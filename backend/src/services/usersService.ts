import { format, fromUnixTime } from "date-fns";
import chatLogRepository from "src/db/repositories/chatLogRepository";
import refreshTokensRepository from "src/db/repositories/refreshTokensRepository";
import subscribersRepository from "src/db/repositories/subscribersRepository";
import usersRepository from "src/db/repositories/usersRepository";
import { ChatLogInsert } from "src/db/schema/chatLog";
import { InsetSubscriber } from "src/db/schema/subscriber";
import { User } from "src/db/schema/user";
import { ApiError } from "src/errors/apiError";
import { UsersError } from "src/errors/usersError";
import { SignUpLoginModel } from "src/models/users/signUpLogin";
import { UserModel, UserUpdate } from "src/models/users/user";
import jwtTokensService from "src/utils/jwtTokensService";
import passwordService from "src/utils/passwordService";
import { uuid } from "uuidv4";
import chatGptService from "./chatGptService";
import stripeService from "./stripeService";

class UsersService {
  signUp = async (model: SignUpLoginModel) => {
    const { email, password } = model;
    const existingUser = await usersRepository.getByEmail(email);
    if (existingUser) {
      throw UsersError.AlreadyExists("User");
    }
    const passwordHash = await passwordService.hashPassword(password);
    const newUser: User = {
      email: email,
      passwordHash: passwordHash,
      id: uuid(),
      name: null,
      questions: 5,
      phoneNumber: null,
    };
    await usersRepository.addNew(newUser);
  };
  login = async (model: SignUpLoginModel) => {
    const { email, password } = model;
    const existingUser = await usersRepository.getByEmail(email);
    if (!existingUser) {
      throw UsersError.NotFound("User");
    }
    const { passwordHash } = existingUser;
    const isPasswordCorrect = await passwordService.validatePassword(
      password,
      passwordHash
    );
    if (!isPasswordCorrect) {
      throw UsersError.WrongPassword();
    }
    const { id: userId } = existingUser;
    const { accessToken } = await jwtTokensService.generateAccessToken(userId);
    const { refreshToken } = await jwtTokensService.generateRefreshToken(
      userId
    );
    await refreshTokensRepository.addRefreshToken(userId, refreshToken);
    return { accessToken, refreshToken };
  };
  setIndividual = async (individualName: string, userId: string) => {
    const existingUser = await usersRepository.getById(userId);
    if (!existingUser) {
      throw ApiError.NotFound("User");
    }
    await usersRepository.setIndividual(individualName, userId);
  };
  getAnswer = async (question: string, userId: string) => {
    const existingUser = await usersRepository.getById(userId);
    if (!existingUser) {
      throw ApiError.NotFound;
    }
    const individual = await usersRepository.getCurrentIndividual(userId);
    if (!individual) {
      throw UsersError.NoIndividualSet();
    }
    const { individualName } = individual;
    const answer = await chatGptService.getAnswerFromClient(
      individualName,
      question
    );
    const chatLog: ChatLogInsert = {
      userId,
      individual: individualName,
      question,
      answer,
    };
    const subscriber = await usersRepository.isSubscriber(userId);
    if (subscriber) {
      const { status: subStatus } = await stripeService.getSubscription(userId);
      if (subStatus === "active") {
        await chatLogRepository.createChatLog(chatLog);
        return answer;
      }
    }
    const { questions } = existingUser;
    if (questions === 0) {
      throw UsersError.QuestionsLimit();
    }
    existingUser.questions--;
    await usersRepository.updateUser(existingUser);
    await chatLogRepository.createChatLog(chatLog);
    return answer;
  };
  addToSubscribers = async (
    userEmail: string,
    stripeSubId: string,
    stripeCustomerId: string,
    nextPaymentDate: number
  ) => {
    const existingUser = await usersRepository.getByEmail(userEmail);
    if (!existingUser) {
      throw ApiError.NotFound("User");
    }
    const { id } = existingUser;
    const subscriber: InsetSubscriber = {
      userId: id,
      stripeSubId: stripeSubId,
      stripeCustomerId: stripeCustomerId,
      nextPaymentDate: nextPaymentDate,
    };
    const isSubscriber = await usersRepository.isSubscriber(id);
    if (!isSubscriber) {
      await subscribersRepository.addSubscriber(subscriber);
    }
    await subscribersRepository.updateSubscriber(subscriber);
  };
  removeFromSubscribers = async (stripeCustomerId: string) => {
    await subscribersRepository.deleteSubscriber(stripeCustomerId);
  };
  updateUser = async (userModel: UserUpdate, userId: string) => {
    const { password, email, name } = userModel;
    const existingUser = await usersRepository.getById(userId);
    if (!existingUser) {
      throw ApiError.NotFound("User");
    }
    const { email: existingUserEmail, passwordHash: oldHash } = existingUser;
    if (existingUserEmail === email) {
      throw ApiError.AlreadyExists("User");
    }
    let updateEmail = existingUserEmail;
    if (email !== null) {
      updateEmail = email;
    }
    const isSubscriber = await usersRepository.isSubscriber(userId);
    if (isSubscriber) {
      await stripeService.updateCustomer(userId, updateEmail, name);
    }
    let passwordHash = oldHash;
    if (password !== null) {
      passwordHash = await passwordService.hashPassword(password);
    }
    const { questions, id } = existingUser;
    const user: User = Object.assign({}, userModel, {
      email: updateEmail,
      passwordHash: passwordHash,
      questions: questions,
      id: id,
      password: undefined,
    });
    return await usersRepository.updateUser(user);
  };
  getAccountDetails = async (userId: string): Promise<UserModel> => {
    const user = await usersRepository.getById(userId);
    if (!user) {
      throw ApiError.NotFound("User");
    }
    const userModel: UserModel = Object.assign({}, user, {
      passwordHash: undefined,
      id: undefined,
      subscriptionInfo: null,
      questions: undefined,
    });
    const subscriber = await usersRepository.isSubscriber(userId);
    if (subscriber) {
      const { nextPaymentDate } = subscriber;
      const date = fromUnixTime(nextPaymentDate);
      userModel.subscriptionInfo = {
        nextPaymentDate: format(date, "MMMM d, yyyy"),
      };
    }
    return userModel;
  };
}

const usersService = new UsersService();
export default usersService;

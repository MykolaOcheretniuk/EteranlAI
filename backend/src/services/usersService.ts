import subscribersRepository from "src/db/repositories/subscribersRepository";
import usersRepository from "src/db/repositories/usersRepository";
import { InsetSubscriber } from "src/db/schema/subscriber";
import { User } from "src/db/schema/user";
import { ApiError } from "src/errors/apiError";
import { UsersError } from "src/errors/usersError";
import { SignUpLoginModel } from "src/models/users/signUpLogin";
import { UserUpdate } from "src/models/users/user";
import jwtTokensService from "src/utils/jwtTokensService";
import passwordService from "src/utils/passwordService";
import { uuid } from "uuidv4";
import chatGptService from "./chatGptService";

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
    const { id: userId } = newUser;
    await usersRepository.addNew(newUser);
    return await jwtTokensService.generateAccessToken(userId);
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
    return await jwtTokensService.generateAccessToken(userId);
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
    const { individualName } = await usersRepository.getCurrentIndividual(
      userId
    );
    const subscriber = await usersRepository.isSubscriber(userId);
    const { subscriptionEnds } = subscriber;
    const currentUnixSeconds = Date.now() / 1000;
    if (!subscriber || currentUnixSeconds > subscriptionEnds) {
      const { questions } = existingUser;
      if (questions === 0) {
        throw UsersError.QuestionsLimit();
      }
      existingUser.questions--;
      await usersRepository.updateUser(existingUser);
      return await chatGptService.getAnswer(individualName, question);
    }
    return await chatGptService.getAnswer(individualName, question);
  };
  addToSubscribers = async (
    userEmail: string,
    subscriptionEnds: number,
    subscriptionStart: number,
    stripeSubId: string
  ) => {
    const existingUser = await usersRepository.getByEmail(userEmail);
    if (!existingUser) {
      throw ApiError.NotFound("User");
    }
    const { id } = existingUser;
    const subscriber: InsetSubscriber = {
      userId: id,
      subscriptionEnds: subscriptionEnds,
      subscriptionStart: subscriptionStart,
      stripeSubId: stripeSubId,
    };
    const isSubscriber = await usersRepository.isSubscriber(id);
    if (!isSubscriber) {
      await subscribersRepository.addSubscriber(subscriber);
    }
    await subscribersRepository.updateSubscriber(subscriber);
  };
  updateUser = async (userModel: UserUpdate, userId: string) => {
    const { password, email } = userModel;
    const existingUser = await usersRepository.getById(userId);
    if (!existingUser) {
      throw ApiError.NotFound("User");
    }
    const { email: existingUserEmail } = existingUser;
    if (existingUserEmail === email) {
      throw ApiError.AlreadyExists("User");
    }
    const { questions, id } = existingUser;
    const user: User = Object.assign({}, userModel, {
      passwordHash: await passwordService.hashPassword(password),
      questions: questions,
      id: id,
      password: undefined,
    });
    return await usersRepository.updateUser(user);
  };
}

const usersService = new UsersService();
export default usersService;

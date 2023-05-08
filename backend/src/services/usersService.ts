import usersRepository from "src/db/repositories/usersRepository";
import { User } from "src/db/schema/user";
import { ApiError } from "src/errors/apiError";
import { UsersError } from "src/errors/usersError";
import { SignUpLoginModel } from "src/models/users/signUpLogin";
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
    const { individualName } = await usersRepository.getCurrentIndividual(
      userId
    );
    const { choices: answerData } = await chatGptService.getAnswer(
      individualName,
      question
    );
    const { message: answerMessage } = answerData[0];
    return answerMessage.content;
  };
}

const usersService = new UsersService();
export default usersService;

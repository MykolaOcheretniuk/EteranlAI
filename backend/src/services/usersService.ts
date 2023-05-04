import usersRepository from "src/db/repositories/usersRepository";
import { User } from "src/db/schema/user";
import { SignUpLoginModel } from "src/models/users/signUpLogin";
import passwordService from "src/utils/passwordService";
import { uuid } from "uuidv4";

class UsersService {
  signUp = async (model: SignUpLoginModel) => {
    const { email, password } = model;
    const existingUser = await usersRepository.getByEmail(email);
    if (existingUser) {
      throw new Error("User is already exists");
    }
    const passwordHash = await passwordService.hashPassword(password);
    const newUser: User = {
      email: email,
      passwordHash: passwordHash,
      id: uuid(),
      name: null,
    };
    await usersRepository.addNew(newUser);
  };
}

const usersService = new UsersService();
export default usersService;

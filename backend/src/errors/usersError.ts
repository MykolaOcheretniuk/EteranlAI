import { ApiError } from "./apiError";

export class UsersError extends ApiError {
  constructor(message: string, code: number) {
    super(message, code);
  }
  static WrongPassword() {
    return new UsersError(`Incorrect password`, 400);
  }
  static QuestionsLimit() {
    return new UsersError(`your 5 free question is over`, 403);
  }
  static NoIndividualSet() {
    return new UsersError("Individual to chat with user was not set", 400);
  }
}

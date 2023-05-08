import { ApiError } from "./apiError";

export class UsersError extends ApiError {
  constructor(message: string, code: number) {
    super(message, code);
  }
  static WrongPassword() {
    return new UsersError(`Incorrect password`, 400);
  }

}

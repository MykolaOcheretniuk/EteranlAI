export class ApiError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
  static NotFound(entity: string) {
    return new ApiError(`${entity} not found`, 404);
  }
  static AlreadyExists(entity: string) {
    return new ApiError(`${entity} is already exists`, 400);
  }
}

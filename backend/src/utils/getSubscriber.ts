import usersRepository from "src/db/repositories/usersRepository";
import { ApiError } from "src/errors/apiError";

const getSubscriber = async (userId: string) => {
  const subscriber = await usersRepository.isSubscriber(userId);
  if (!subscriber) {
    throw ApiError.NotFound("Subscriber");
  }
  return subscriber;
};
export default getSubscriber;

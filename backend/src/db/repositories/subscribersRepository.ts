import { users } from "../schema/user";
import { BaseRepository } from "./baseRepository";
import { eq } from "drizzle-orm";
import { InsetSubscriber, subscribers } from "../schema/subscriber";
class SubscribersRepository extends BaseRepository {
  addSubscriber = async (subscriber: InsetSubscriber) => {
    await this.db.insert(subscribers).values(subscriber);
  };
  updateSubscriber = async (subscriber: InsetSubscriber) => {
    const { userId } = subscriber;
    await this.db
      .update(subscribers)
      .set(subscriber)
      .where(eq(subscribers.userId, userId));
  };
}

const subscribersRepository = new SubscribersRepository(users);
export default subscribersRepository;

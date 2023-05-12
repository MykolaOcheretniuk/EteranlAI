import { User, users } from "../schema/user";
import { BaseRepository } from "./baseRepository";
import { eq } from "drizzle-orm";
import { userIndividualChat } from "../schema/userIndividual";
import { Subscriber, subscribers } from "../schema/subscriber";
class UsersRepository extends BaseRepository {
  getById = async (id: string): Promise<User> => {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  };
  addNew = async (user: User) => {
    return await this.db.insert(users).values(user);
  };
  getByEmail = async (email: string): Promise<User> => {
    const result = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return result[0];
  };
  setIndividual = async (individualName: string, userId: string) => {
    const userIndividual = await this.db
      .select()
      .from(userIndividualChat)
      .where(eq(userIndividualChat.userId, userId));
    if (!userIndividual[0]) {
      await this.db
        .insert(userIndividualChat)
        .values({ userId: userId, individualName: individualName });
    }
    await this.db
      .update(userIndividualChat)
      .set({ individualName: individualName })
      .where(eq(userIndividualChat.userId, userId));
  };
  getCurrentIndividual = async (userId: string) => {
    const result = await this.db
      .select({ individualName: userIndividualChat.individualName })
      .from(userIndividualChat)
      .where(eq(userIndividualChat.userId, userId));
    return result[0];
  };
  updateUser = async (user: User) => {
    const { id } = user;
    await this.db.update(users).set(user).where(eq(users.id, id));
  };
  isSubscriber = async (userId: string): Promise<Subscriber> => {
    const result = await this.db
      .select({
        questions: users.questions,
        userId: subscribers.userId,
        stripeSubId: subscribers.stripeSubId,
        stripeCustomerId: subscribers.stripeCustomerId,
      })
      .from(subscribers)
      .innerJoin(users, eq(users.id, subscribers.userId))
      .where(eq(subscribers.userId, userId));
    return result[0];
  };
}

const usersRepository = new UsersRepository(users);
export default usersRepository;

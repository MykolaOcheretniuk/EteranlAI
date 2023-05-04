import { User, users } from "../schema/user";
import { BaseRepository } from "./baseRepository";
import { eq } from "drizzle-orm";
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
}

const usersRepository = new UsersRepository(users);
export default usersRepository;

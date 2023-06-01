import { BaseRepository } from "./baseRepository";
import { RefreshTokens, refreshTokens } from "../schema/tokens";
import { eq } from "drizzle-orm";
class RefreshTokensRepository extends BaseRepository {
  addRefreshToken = async (userId: string, refreshToken: string) => {
    const existingToken = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, userId));
    if (!existingToken[0]) {
      await this.db.insert(refreshTokens).values({ userId, refreshToken });
    }
    await this.db
      .update(refreshTokens)
      .set({ refreshToken })
      .where(eq(refreshTokens.userId, userId));
  };
  getRefreshToken = async (userId: string): Promise<RefreshTokens> => {
    const existingToken = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, userId));
    return existingToken[0];
  };
}

const refreshTokensRepository = new RefreshTokensRepository(refreshTokens);
export default refreshTokensRepository;

import { InferModel } from "drizzle-orm";
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { users } from "./user";

export const refreshTokens = mysqlTable("RefreshTokens", {
  userId: varchar("UserId", { length: 70 })
    .notNull()
    .references(() => users.id),
  refreshToken: varchar("RefreshToken", { length: 250 }).notNull(),
});
export type RefreshTokens = InferModel<typeof refreshTokens, "select">;
export type RefreshTokensTable = typeof refreshTokens;

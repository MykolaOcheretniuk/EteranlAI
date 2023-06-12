import { InferModel } from "drizzle-orm";
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { users } from "./user";

export const userSocketConnection = mysqlTable("UserSocketConnection", {
  userId: varchar("UserId", { length: 70 })
    .notNull()
    .references(() => users.id),
  connectionId: varchar("ConnectionId", { length: 100 }).notNull(),
});
export type UserSocket = InferModel<typeof userSocketConnection, "select">;

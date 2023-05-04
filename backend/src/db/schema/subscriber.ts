import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { users } from "./user";

export const subscribers = mysqlTable("Subscribers", {
  userId: varchar("UserId", { length: 70 })
    .notNull()
    .references(() => users.id),
});

export type SubscribersTable = typeof subscribers;

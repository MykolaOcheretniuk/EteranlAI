import { InferModel } from "drizzle-orm";
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { User, users } from "./user";

export const subscribers = mysqlTable("Subscribers", {
  userId: varchar("UserId", { length: 70 })
    .notNull()
    .references(() => users.id),
  stripeSubId: varchar("StripeSubId", { length: 100 }).notNull(),
  stripeCustomerId: varchar("StripeCustomerId", { length: 100 }).notNull(),
});

export type SubscribersTable = typeof subscribers;
export type InsetSubscriber = InferModel<typeof subscribers, "insert">;
interface Sub extends User {
  userId: string;
  stripeSubId: string;
  stripeCustomerId: string;
}
export type Subscriber = Omit<
  Sub,
  "id" | "passwordHash" | "email" | "name" | "phoneNumber"
>;

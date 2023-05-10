import { InferModel } from "drizzle-orm";
import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { User, users } from "./user";

export const subscribers = mysqlTable("Subscribers", {
  userId: varchar("UserId", { length: 70 })
    .notNull()
    .references(() => users.id),
  subscriptionStart: int("SubscriptionStart").notNull(),
  subscriptionEnds: int("SubscriptionEnds").notNull(),
  stripeSubId: varchar("StripeSubId", { length: 100 }).notNull(),
});

export type SubscribersTable = typeof subscribers;
export type InsetSubscriber = InferModel<typeof subscribers, "insert">;
interface Sub extends User {
  userId: string;
  subscriptionStart: number;
  subscriptionEnds: number;
  stripeSubId: string;
}
export type Subscriber = Omit<
  Sub,
  "id" | "passwordHash" | "email" | "name" | "phoneNumber"
>;

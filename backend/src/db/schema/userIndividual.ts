import { mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { individuals } from "./Individual";
import { users } from "./user";

export const userIndividualChat = mysqlTable("UserIndividualChat", {
  userId: varchar("UserId", { length: 70 })
    .notNull()
    .references(() => users.id),
  individualName: varchar("IndividualName", { length: 100 })
    .notNull()
    .references(() => individuals.name),
});

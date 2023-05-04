import { InferModel } from "drizzle-orm";
import { mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const individuals = mysqlTable("Individuals", {
  name: varchar("Name", { length: 100 }).notNull().primaryKey(),
});

export type Individual = InferModel<typeof individuals, "select">;
export type IndividualsTable = typeof individuals;

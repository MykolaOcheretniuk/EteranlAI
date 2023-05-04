import { MySql2Database } from "drizzle-orm/mysql2";
import { database } from "../dbConnection";
import { IndividualsTable } from "../schema/Individual";
import { SubscribersTable } from "../schema/subscriber";
import { UsersTable } from "../schema/user";

export abstract class BaseRepository {
  protected table: IndividualsTable | SubscribersTable | UsersTable;
  protected db: MySql2Database;
  constructor(table: IndividualsTable | SubscribersTable | UsersTable) {
    this.table = table;
    this.db = database;
  }
}

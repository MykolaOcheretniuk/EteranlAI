import { MySql2Database } from "drizzle-orm/mysql2";
import { database } from "../dbConnection";
import { SubscribersTable } from "../schema/subscriber";
import { UsersTable } from "../schema/user";

export abstract class BaseRepository {
  protected table: SubscribersTable | UsersTable;
  protected db: MySql2Database;
  constructor(table: SubscribersTable | UsersTable) {
    this.table = table;
    this.db = database;
  }
}

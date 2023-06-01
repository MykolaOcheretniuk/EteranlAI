import { MySql2Database } from "drizzle-orm/mysql2";
import { database } from "../dbConnection";
import { ChatLogTable } from "../schema/chatLog";
import { SubscribersTable } from "../schema/subscriber";
import { RefreshTokensTable } from "../schema/tokens";
import { UsersTable } from "../schema/user";

export abstract class BaseRepository {
  protected table:
    | SubscribersTable
    | UsersTable
    | RefreshTokensTable
    | ChatLogTable;
  protected db: MySql2Database;
  constructor(
    table: SubscribersTable | UsersTable | RefreshTokensTable | ChatLogTable
  ) {
    this.table = table;
    this.db = database;
  }
}

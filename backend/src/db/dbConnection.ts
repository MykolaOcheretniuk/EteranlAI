import { drizzle } from "drizzle-orm/mysql2";
import * as mysql from "mysql2/promise";
import getEnv from "src/utils/getEnv";

const poolConnection = mysql.createPool({
  connectionLimit: 100,
  host: getEnv("ETERNAL_AI_DB_ENDPOINT"),
  user: getEnv("ETERNAL_AI_DB_USERNAME"),
  database: getEnv("ETERNAL_AI_DB_NAME"),
  password: getEnv("ETERNAL_AI_DB_PASSWORD"),
  port: parseInt(getEnv("DB_PORT") as string),
});

export const database = drizzle(poolConnection);

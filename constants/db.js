 import { config } from "dotenv"
import postgres from "postgres"
config()
//load env variables
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbName = process.env.DB_NAME
export const sql =
postgres(`postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`);
// postgres://username:password@host:port/database
// Example: postgres://johnson:my_password@localhost:5432/my_database

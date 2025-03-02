// src/config/db.ts
import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();


export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  // or user, password, host, port, database if not using a single URL
});

import { Pool } from "pg";
import dotenv from "dotenv";
// src/config/db.ts

import { createClient } from "@supabase/supabase-js"
import "dotenv/config" // so process.env is populated, if not done elsewhere

// 1) Grab your env variables first
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

// 2) Validate them
if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL in environment.")
}

if (!supabaseAnonKey) {
  throw new Error("Missing SUPABASE_ANON_KEY in environment.")
}

// 3) Now create the client (TypeScript sees supabaseUrl and supabaseAnonKey are definitely strings)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)



// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, 
// });

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false, } 
});
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection error:", err));

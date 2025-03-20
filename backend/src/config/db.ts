import { Pool } from "pg";
import dotenv from "dotenv";

import { createClient } from "@supabase/supabase-js"
import "dotenv/config" 


const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY


if (!supabaseUrl) {
  throw new Error("Missing SUPABASE_URL in environment.")
}

if (!supabaseAnonKey) {
  throw new Error("Missing SUPABASE_ANON_KEY in environment.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)




export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection error:", err));

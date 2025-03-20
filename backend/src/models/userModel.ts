import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
});

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  name?: string;
  avatarUrl?: string;
  city?: string;
};


export async function createUser(user: User): Promise<User | null> {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const query = `
    INSERT INTO users (username, email, password, name, avatar_url, city)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, name, avatar_url, city
  `;
  const values = [user.username, user.email, hashedPassword, user.name, user.avatarUrl, user.city];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}


export async function findUserByEmail(email: string) {
  try {
    console.log("Checking for user with email:", email);
    
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1", 
      [email]
    );

    console.log("Query result:", result.rows);
    return result.rows[0];

  } catch (error) {
    console.error("Database error in findUserByEmail:", error);
    throw error;
  }
}

import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../config/db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret"; // Ensure you have JWT_SECRET in .env

// **REGISTER FUNCTION**
export async function register(req: Request, res: Response) {
  try {
    console.log("📩 Incoming Registration Request:", req.body); // Debugging Log

    const { email, username, password, name, avatarUrl} = req.body;

    if (!email || !username || !password) {
      console.error("❌ Missing required fields");
      return res.status(400).json({ message: "Email, username, and password are required" });
    }

    // Check if user already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      console.error("⚠️ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await pool.query(
      "INSERT INTO users (email, username, password_hash, name, avatar_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [email, username, hashedPassword, name || "", avatarUrl || ""]
    );

    console.log("✅ User Registered:", newUser.rows[0]);

    // Generate JWT Token
    const token = jwt.sign({ userId: newUser.rows[0].id }, SECRET_KEY, { expiresIn: "7d" });

    return res.status(201).json({
      token,
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        username: newUser.rows[0].username,
        name: newUser.rows[0].name,
        avatarUrl: newUser.rows[0].avatar_url,
       },
    });
  } catch (error) {
    console.error("🔥 Registration Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// **LOGIN FUNCTION**
export async function login(req: Request, res: Response) {
  try {
    console.log("🔑 Incoming Login Request:", req.body); // Debugging Log

    const { email, password } = req.body;
    if (!email || !password) {
      console.error("❌ Missing required fields");
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      console.error("❌ Invalid email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      console.error("❌ Invalid password for user:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("✅ User Logged In:", user.rows[0].email);

    // Generate JWT Token
    const token = jwt.sign({ userId: user.rows[0].id }, SECRET_KEY, { expiresIn: "7d" });

    return res.json({
      token,
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        username: user.rows[0].username,
        name: user.rows[0].name,
        avatarUrl: user.rows[0].avatar_url,
       
      },
    });
  } catch (error) {
    console.error("🔥 Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

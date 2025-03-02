// src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "someVerySecretKey";

export async function register(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
      [email, passwordHash]
    );

    // Generate JWT
    const token = jwt.sign({ userId: newUser.rows[0].id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ token, email });
  } catch (err: any) {
    console.error("Register error", err);
    return res.status(500).json({ message: "Server error." });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    // Check user
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const valid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate token
    const token = jwt.sign({ userId: user.rows[0].id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ token, email });
  } catch (err: any) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error." });
  }
}

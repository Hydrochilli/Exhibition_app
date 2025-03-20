import { Request, Response } from "express";
import { findUserByEmail } from "../models/userModel";

export async function getUserProfile(req: Request, res: Response) {
  const userEmail = (req as any).user.email;

  const user = await findUserByEmail(userEmail);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ id: user.id, username: user.username, email: user.email, name: user.name, avatarUrl: user.avatarUrl });
}

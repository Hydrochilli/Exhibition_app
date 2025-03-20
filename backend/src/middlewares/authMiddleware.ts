import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

interface AuthPayload {
  userId: number;
  email: string;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: "Missing authorization header" });
      return;
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      res.status(401).json({ message: "Token missing from authorization header" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

    (req as any).user = { userId: decoded.userId, email: decoded.email };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default requireAuth;

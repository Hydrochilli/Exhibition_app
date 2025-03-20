import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};



export default requireAuth
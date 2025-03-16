import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Your authentication logic here (e.g., JWT validation)
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// export function requireAuth(req: Request, res: Response, next: NextFunction) {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     (req as any).user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// }

export default requireAuth
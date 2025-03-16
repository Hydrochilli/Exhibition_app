import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getUserProfile } from "../controllers/userController";

const router = Router();

router.get("/me", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  await getUserProfile(req, res);
});

export default router;

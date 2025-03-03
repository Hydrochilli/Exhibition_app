import { Router, Request, Response, RequestHandler } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getUserProfile } from "../controllers/userController";

const router = Router();

router.get("/me", requireAuth as RequestHandler, async (req: Request, res: Response) => {
  await getUserProfile(req, res);
});

export default router;


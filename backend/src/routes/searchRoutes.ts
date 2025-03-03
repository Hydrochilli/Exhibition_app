import { Router, Request, Response } from "express";
import { handleSearch } from "../controllers/searchController";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  await handleSearch(req, res);
});

export default router;

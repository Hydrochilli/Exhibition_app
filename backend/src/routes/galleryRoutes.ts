import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import {
  saveGallery,
  getUserGalleries,
  createGallery,
  addArtworkToGallery,
} from "../controllers/galleryController";

const router = Router();

// router.get("/user", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
//   await getUserGalleries(req, res);
// });
router.get("/user", requireAuth, getUserGalleries);



router.post("/save", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  await saveGallery(req, res);
});


router.post("/", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  await createGallery(req, res);
});

router.post("/:galleryId/artworks", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  await addArtworkToGallery(req, res);
});

router.post("/create", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  await createGallery(req, res);
});

export default router;

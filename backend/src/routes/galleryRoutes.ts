import { Router, RequestHandler } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { getGalleries, createGallery, addArtworkToGallery, getUserGalleries } from "../controllers/galleryController";

const router = Router();

router.get("/user", requireAuth, getUserGalleries);

router.get("/", requireAuth as RequestHandler, async (req, res) => {
  await getGalleries(req, res);
});

router.post("/", requireAuth as RequestHandler, async (req, res) => {
  await createGallery(req, res);
});

router.post("/:galleryId/artworks", requireAuth as RequestHandler, async (req, res) => {
  await addArtworkToGallery(req, res);
});

export default router;

// src/routes/galleryRoutes.ts
import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware";
import { getGalleries, createGallery, addArtworkToGallery } from "../controllers/galleryController";

const router = Router();

// All these routes require auth
router.get("/", requireAuth, getGalleries);
router.post("/", requireAuth, createGallery);
router.post("/:galleryId/artworks", requireAuth, addArtworkToGallery);

export default router;

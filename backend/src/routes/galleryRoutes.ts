import { Router, RequestHandler } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { pool } from "../config/db";
import {
  saveGallery,
  getUserGalleries,
  getGalleries,
  createGallery,
  addArtworkToGallery,
} from "../controllers/galleryController";

const router = Router();

// Fetch galleries for a specific user
router.get("/user/:userId", requireAuth, getUserGalleries);

// Save temporary collection as a gallery
router.post("/save", requireAuth, saveGallery);

// Fetch galleries for the authenticated user
router.get("/user", requireAuth, getUserGalleries);

// Get all galleries for the logged-in user
router.get("/", requireAuth as RequestHandler, async (req, res) => {
  await getGalleries(req, res);
});

// Create a new gallery
router.post("/", requireAuth as RequestHandler, async (req, res) => {
  await createGallery(req, res);
});

// Add an artwork to a specific gallery
router.post("/:galleryId/artworks", requireAuth as RequestHandler, async (req, res) => {
  await addArtworkToGallery(req, res);
});

// Create a new gallery with artworks
router.post("/create", requireAuth, async (req, res) => {
  const { title, description, artworks } = req.body;
  const userId = (req as any).user.userId; // Extract user ID from JWT middleware

  try {
    // Insert new gallery into the database
    const newGallery = await pool.query(
      "INSERT INTO galleries (user_id, title, description, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id",
      [userId, title, description]
    );

    const galleryId = newGallery.rows[0].id;

    // Insert artworks into the gallery
    const artworkPromises = artworks.map((art: any) =>
      pool.query(
        "INSERT INTO gallery_artworks (gallery_id, external_id, title, image_url) VALUES ($1, $2, $3, $4)",
        [galleryId, art.id, art.title, art.imageUrl]
      )
    );

    await Promise.all(artworkPromises);

    res.status(201).json({ message: "Gallery created successfully!", galleryId });
  } catch (error) {
    console.error("Error creating gallery:", error);
    res.status(500).json({ message: "Failed to save gallery." });
  }
});

export default router;

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

router.post("/create", requireAuth, async (req, res) => {
  const { title, description, artworks } = req.body;
  const userId = req.userId; 

  try {
    const newGallery = await pool.query(
      "INSERT INTO galleries (user_id, title, description, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id",
      [userId, title, description]
    );

    const galleryId = newGallery.rows[0].id;
    for (const art of artworks) {
      await pool.query(
        "INSERT INTO gallery_items (gallery_id, artwork_id, title, image_url) VALUES ($1, $2, $3, $4)",
        [galleryId, art.id, art.title, art.imageUrl]
      );
    }

    res.status(201).json({ message: "Gallery created!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save gallery." });
  }
});


export default router;

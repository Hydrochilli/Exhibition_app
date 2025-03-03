import { Request, Response } from "express";
import { pool } from "../config/db";

// Fetch User's Galleries
export async function getUserGalleries(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId; // Extract from JWT middleware
    const result = await pool.query(
      "SELECT id, title, description, created_at FROM galleries WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching user galleries:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Fetch All Galleries
export async function getGalleries(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const galleriesRes = await pool.query(
      "SELECT id, title, description, created_at FROM galleries WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return res.json({ galleries: galleriesRes.rows });
  } catch (err: any) {
    console.error("getGalleries error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Create a New Gallery
export async function createGallery(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { title, description } = req.body;
    const result = await pool.query(
      "INSERT INTO galleries (user_id, title, description, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, title, description, created_at",
      [userId, title, description]
    );
    return res.json({ gallery: result.rows[0] });
  } catch (err: any) {
    console.error("createGallery error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Save Temporary Collection to User's Galleries
export async function saveGallery(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { title, description, artworks } = req.body;

    if (!title || !artworks || artworks.length === 0) {
      return res.status(400).json({ message: "Gallery must have a title and at least one artwork" });
    }

    // Insert gallery
    const galleryResult = await pool.query(
      "INSERT INTO galleries (user_id, title, description, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id",
      [userId, title, description]
    );

    const galleryId = galleryResult.rows[0].id;

    // Insert artworks into the gallery
    const artworkPromises = artworks.map((artwork: any) =>
      pool.query(
        `INSERT INTO gallery_artworks (gallery_id, external_id, source, title, author, date, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          galleryId,
          artwork.id,
          artwork.source,
          artwork.title,
          artwork.author,
          artwork.date,
          artwork.imageUrl,
        ]
      )
    );

    await Promise.all(artworkPromises);

    return res.json({ message: "Gallery saved successfully", galleryId });
  } catch (error) {
    console.error("Error saving gallery:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Add Artwork to an Existing Gallery
export async function addArtworkToGallery(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const galleryId = parseInt(req.params.galleryId);
    const { external_id, source, title, author, date, image_url } = req.body;

    // Verify gallery belongs to this user
    const galRes = await pool.query("SELECT user_id FROM galleries WHERE id = $1", [galleryId]);
    if (galRes.rows.length === 0) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    if (galRes.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "Not your gallery" });
    }

    // Insert artwork
    await pool.query(
      `INSERT INTO gallery_artworks (gallery_id, external_id, source, title, author, date, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [galleryId, external_id, source, title, author, date, image_url]
    );
    return res.json({ message: "Artwork added successfully" });
  } catch (err: any) {
    console.error("addArtworkToGallery error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

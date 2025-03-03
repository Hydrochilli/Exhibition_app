// src/controllers/galleryController.ts
import { Request, Response } from "express";
import { pool } from "../config/db";

export async function getUserGalleries(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId; // Extract from JWT middleware
    const result = await pool.query("SELECT id, title, thumbnail FROM galleries WHERE user_id = $1", [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching user galleries:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getGalleries(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const galleriesRes = await pool.query(
      "SELECT id, name FROM galleries WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    // For each gallery, optionally fetch artworks or do separate endpoints
    return res.json({ galleries: galleriesRes.rows });
  } catch (err: any) {
    console.error("getGalleries error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function createGallery(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { name } = req.body;
    const result = await pool.query(
      "INSERT INTO galleries (user_id, name) VALUES ($1, $2) RETURNING id, name",
      [userId, name]
    );
    return res.json({ gallery: result.rows[0] });
  } catch (err: any) {
    console.error("createGallery error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

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

    // Insert
    await pool.query(
      `INSERT INTO gallery_artworks (gallery_id, external_id, source, title, author, date, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [galleryId, external_id, source, title, author, date, image_url]
    );
    return res.json({ message: "Artwork added" });
  } catch (err: any) {
    console.error("addArtworkToGallery error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

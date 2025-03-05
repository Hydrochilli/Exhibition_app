// src/index.ts
import express from "express";
import cors from "cors";
import { Pool } from "pg";
import authRoutes from "./routes/authRoutes";
import searchRoutes from "./routes/searchRoutes";
import galleryRoutes from "./routes/galleryRoutes";
import { fetchEuropeanaGalleries } from "./controllers/europeanaController";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/europeana/galleries", async (req, res) => {
  try {
    const { page = 1, pageSize = 12 } = req.query;
    const data = await fetchEuropeanaGalleries(Number(page), Number(pageSize));
    res.json(data);
  } catch (error) {
    console.error("Europeana API error:", error);
    res.status(500).json({ message: "Failed to fetch galleries." });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/galleries", galleryRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

// src/index.ts
import express from "express";
import cors from "cors";
import { Pool } from "pg";
import authRoutes from "./routes/authRoutes";
import searchRoutes from "./routes/searchRoutes";
import galleryRoutes from "./routes/galleryRoutes";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/galleries", galleryRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

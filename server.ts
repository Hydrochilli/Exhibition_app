import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./backend/src/routes/authRoutes";
import userRoutes from "./backend/src/routes/userRoutes";
import galleryRoutes from "./backend/src/routes/galleryRoutes";

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// API Routes
// ✅ Use Europeana routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/galleries", galleryRoutes);

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

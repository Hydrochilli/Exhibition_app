import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import authRoutes from "./backend/src/routes/authRoutes";
import userRoutes from "./backend/src/routes/userRoutes";
import galleryRoutes from "./routes/galleryRoutes"; 
dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Authentication & User Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/galleries", galleryRoutes);  
/**
 * 📌 Europeana API Proxy Route
 * Example: GET http://localhost:3001/api/europeana?query=van%20gogh&rows=20&start=1&qf=TYPE:IMAGE
 */
app.get("/api/europeana", async (req, res) => {
  try {
    const { query, rows, start, qf } = req.query;

    const response = await axios.get("https://api.europeana.eu/record/v2/search.json", {
      params: {
        wskey: process.env.EUROPEANA_API_KEY, // Use an environment variable for the API key
        query,
        rows,
        start,
        qf,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Europeana Proxy Error:", error.message);
    res.status(500).json({ error: "Failed to fetch data from Europeana API." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

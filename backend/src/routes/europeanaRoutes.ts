import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const EUROPEANA_API_KEY = process.env.EUROPEANA_API_KEY || "ggosewbi";

/**
 * GET /api/europeana/galleries
 * Hardcode EXACT known-working query from cURL, AND spoof the user-agent.
 */
router.get("/galleries", async (_req, res) => {
  try {
    console.log("\n[Europeana /set/search] Hardcoded request with custom UA");

    // Hardcode the same query used in your cURL snippet
    const params = {
      wskey: EUROPEANA_API_KEY,
      query: "*",
      start: 0,                       // same as cURL
      qf: "type:EntityBestItemsSet",
      page: 1,
      pageSize: 12,
      profile: "standard",
    };

    // Spoof the user-agent as actual cURL to see if Europeana accepts
    const response = await axios.get("https://api.europeana.eu/set/search", {
      params,
      headers: {
        "User-Agent": "curl/7.87.0", // or whatever your local cURL version is
      },
    });

    console.log(`[Europeana /set/search] HTTP ${response.status}`);

    const data = response.data;
    if (!data.items) {
      throw new Error("No 'items' field in Europe's response.");
    }

    // Filter or just pass them through
    const items = data.items.filter(
      (set: any) => set.type === "EntityBestItemsSet"
    );

    return res.json({
      items,
      total: data.total,
    });
  } catch (error: any) {
    console.error("❌ Hardcoded + UA Europeana /set/search error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to fetch Europeana sets." });
  }
});

export default router;


import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const EUROPEANA_API_KEY = process.env.EUROPEANA_API_KEY || "ggosewbi";

router.get('/galleries', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = {
      wskey: EUROPEANA_API_KEY,
      query: "*",
      start: 0,
      qf: "type:EntityBestItemsSet",
      page: 1,
      pageSize: 12,
      profile: "standard",
    };

    const response = await axios.get("https://api.europeana.eu/set/search", {
      params,
      headers: { "User-Agent": "curl/7.87.0" },
    });

    const data = response.data;
    if (!data.items) throw new Error("No 'items' field in Europe's response.");

    const items = data.items.filter((set: any) => set.type === "EntityBestItemsSet");
    res.json({ items, total: data.total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch Europeana sets." });
  }
});

export default router;



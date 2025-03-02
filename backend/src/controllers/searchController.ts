// src/controllers/searchController.ts
import { Request, Response } from "express";
import { getSearchResults } from "../services/cacheService";

// Example query: GET /api/search?q=van+gogh&century=19&department=European
export async function handleSearch(req: Request, res: Response) {
  try {
    const { q, century, department, apiSource } = req.query;
    // We'll parse them as strings
    const searchTerm = (q as string) || "";
    const centuryStr = (century as string) || "";
    const deptStr = (department as string) || "";
    const sourceStr = (apiSource as string) || "All";

    const results = await getSearchResults(searchTerm, centuryStr, deptStr, sourceStr);
    return res.json({ results });
  } catch (err: any) {
    console.error("handleSearch error:", err);
    return res.status(500).json({ message: "Server error." });
  }
}

// server.js
import express from "express";
import axios from "axios";
import cors from "cors";  // If you need to allow cross-origin requests to your proxy

const app = express();
const PORT = 3001;

// Optional: If you want your proxy to be accessible from your React dev server
app.use(cors());

/**
 * Proxy route for searching Europeana.
 * e.g., GET http://localhost:3001/api/europeana?query=van%20gogh&rows=20&start=1&qf=TYPE:IMAGE
 */
app.get("/api/europeana", async (req, res) => {
  try {
    // 1. Extract query params from the request
    const { query, rows, start, qf } = req.query;

    // 2. Forward them to Europeana’s endpoint
    const response = await axios.get("https://api.europeana.eu/record/v2/search.json", {
      params: {
        wskey: "ggosewbi",
        query,
        rows,
        start,
        // qf can be an array or single string, depending on your usage
        qf,
      },
    });

    // 3. Send the Europeana data back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error("Proxy Error calling Europeana:", error.message);
    // Return some error to the client
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening at http://localhost:${PORT}`);
});

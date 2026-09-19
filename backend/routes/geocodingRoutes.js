const express = require("express");

const router = express.Router();

const getApiKey = () => {
  const apiKey = process.env.OPENROUTESERVICE_API_KEY;

  if (!apiKey) {
    throw new Error("OpenRouteService API key is not configured");
  }

  return apiKey;
};

router.get("/geocode", async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const url = new URL("https://api.openrouteservice.org/geocode/search");
    url.searchParams.set("api_key", getApiKey());
    url.searchParams.set("text", text);

    const response = await fetch(url);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    console.error("Geocoding proxy error:", error.message);
    res.status(500).json({ error: "Geocoding service unavailable" });
  }
});

router.get("/directions", async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        error: "Start and end coordinates are required"
      });
    }

    const url = new URL(
      "https://api.openrouteservice.org/v2/directions/driving-car"
    );
    url.searchParams.set("api_key", getApiKey());
    url.searchParams.set("start", start);
    url.searchParams.set("end", end);

    const response = await fetch(url);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    console.error("Directions proxy error:", error.message);
    res.status(500).json({ error: "Directions service unavailable" });
  }
});

module.exports = router;
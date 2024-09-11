const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const growwUrl = "https://groww.in/v1/api/data/mf/v1/nfo/list";
  const nuvamaUrl = "https://nwmw.nuvamawealth.com/api/ipo/1.1/getNFOData";

  try {
    // Make both API requests simultaneously
    const [growwResponse, nuvamaResponse] = await Promise.all([
      axios.get(growwUrl),
      axios.get(nuvamaUrl),
    ]);

    // Extract relevant data
    const growwData = growwResponse.data;
    const nuvamaData = nuvamaResponse.data.NFOUpcoming.nfo; // Assuming the key structure is correct

    // Add the new key 'upcoming' with data from Nuvama API
    const combinedData = {
      ...growwData,
      upcoming: nuvamaData,
    };

    // Return the combined data as JSON
    res.json(combinedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

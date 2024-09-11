const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const url = "https://groww.in/v1/api/data/mf/v1/nfo/list";
  try {
    const response = await axios.get(url);
    const combinedData = {
      live: response.data.live,
      closed: response.data.closed,
    };

    const slugs = [
      ...combinedData.closed.map((item) => item.search_id),
      ...combinedData.live.map((item) => item.search_id),
    ];
    res.json(slugs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

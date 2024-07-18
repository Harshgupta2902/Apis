const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  const type = req.query.type;
  const dataCount = req.query.dataCount || 5;
  const offset = req.query.offset || 0;

  const base_url =
    "https://analyze.api.tickertape.in/homepage/stocks?universe=Market&type=";

  if (
    [
      "gainers",
      "losers",
      "active",
      "approachingHigh",
      "approachingLow",
    ].includes(type)
  ) {
    const url = `${base_url}${type}&dataCount=${dataCount}&offset=${offset}`;

    try {
      const response = await axios.get(url);
      // res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ error: "Invalid type parameter" });
  }
});

module.exports = router;

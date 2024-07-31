const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const url = "https://api.tickertape.in/mf-screener/query";
    const response = await axios.post(url, {
      match: {},
      sortBy: "aum",
      sortOrder: -1,
      project: ["subsector", "option", "aum", "ret3y", "expRatio"],
      offset: 20,
      count: 4994,
      mfIds: [],
    });
    const slugs = response.data.data.result.map((fund) => fund.slug);
    res.json(slugs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/:fund", async (req, res) => {
  const { fund } = req.params;
  const url = `https://groww.in/v1/api/data/mf/web/v3/scheme/search/${fund}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

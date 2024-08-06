const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/:amc", async (req, res) => {
  const { amc } = req.params;
  const url = `https://groww.in/v1/api/data/mf/v1/web/content/v2/page/${amc}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

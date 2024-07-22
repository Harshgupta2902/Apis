const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const pan = req.query.pan;
  const url = `https://blog.mysiponline.com/pan.php?pan=${pan}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;

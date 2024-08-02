const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (req, res) => {
  const page = req.query.page ?? 0;
  const category = req.query.category;
  const risk = req.query.risk;
  const sort = req.query.sort ?? 3;  // Default to 3 if sort is not provided

  let params = [
    `available_for_investment=true`,
    `doc_type=scheme`,
    `page=${page}`,
    `plan_type=Direct`,
    `q=`,
    `size=15`,
    `sort_by=${sort}`,
  ];

  if (category) {
    params.push(`category=${category}`);
  }
  if (risk) {
    params.push(`risk=${risk}`);
  }

  const url = `https://groww.in/v1/api/search/v1/derived/scheme?${params.join(
    "&"
  )}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

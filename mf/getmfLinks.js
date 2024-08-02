const axios = require("axios");
const express = require("express");
const router = express.Router();

const baseUrl = "https://groww.in/v1/api/search/v1/derived/scheme";
const totalPages = 106; // Adjust based on the number of pages you want to fetch
const resultsPerPage = 15; // Adjust as per the API's results per page

// Route to get NAV data
router.get("/", async (req, res) => {
  try {
    const allSearchIds = await fetchAllSearchIds();
    res.json(allSearchIds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
async function fetchPage(page) {
  try {
    const response = await axios.get(baseUrl, {
      params: {
        available_for_investment: true,
        doc_type: "scheme",
        page: page,
        plan_type: "Direct",
        size: resultsPerPage,
        sort_by: 3,
      },
    });
    return response.data.content.map((item) => item.search_id);
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error.message);
    return [];
  }
}

async function fetchAllSearchIds() {
  let allSearchIds = [];
  for (let page = 0; page <= totalPages; page++) {
    console.log(`Fetching page ${page}...`);
    const searchIds = await fetchPage(page);
    allSearchIds = allSearchIds.concat(searchIds);
    console.log(`Fetched ${searchIds.length} search_ids from page ${page}`);
  }
  return allSearchIds;
}

const axios = require("axios");
const { db } = require("../firebase");
const express = require("express");
const router = express.Router();

// Route to get NAV data
router.get("/:isin", async (req, res) => {
  const { isin } = req.params;
  if (!isin) {
    return res.status(400).json({ error: "ISIN parameter is required" });
  }
  try {
    const navData = await fetchAndInsertData(isin);
    if (navData) {
      res.json(navData);
    } else {
      res.status(404).json({ error: "NAV data not found for the given ISIN" });
    }
  } catch (error) {
    console.error("Error retrieving NAV data:", error);
    res.status(500).json({ error: "Failed to retrieve NAV data" });
  }
});

const fetchAndInsertData = async (isin) => {
  try {
    const response = await axios.get(
      `https://www.moneycontrol.com/mc/widget/mfnavonetimeinvestment/get_chart_value?isin=${isin}&dur=ALL`
    );
    const apiData = response.data.g1;

    if (apiData && apiData.error_code && apiData.error_msg) {
      console.error(`API Error for ISIN ${isin}: ${apiData[0].error_msg}`);
      return;
    } else {
      // await insertData(isin, apiData);
    }
    console.log(`API data fetched and inserted for ISIN ${isin}`);
    return apiData;
  } catch (error) {
    console.error(`Error fetching or inserting data for ISIN ${isin}:`, error);
    throw error;
  }
};

module.exports = router;

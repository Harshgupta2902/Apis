const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [ipoResponse, gmpResponse, buybackResponse, smeResponse] =
      await Promise.all([
        axios.get("https://apis-iota-five.vercel.app/api/ipo"),
        axios.get("https://apis-iota-five.vercel.app/api/gmp"),
        axios.get("https://apis-iota-five.vercel.app/api/buyback"),
        axios.get("https://apis-iota-five.vercel.app/api/sme"),
      ]);

    console.log("IPO Api Hits SuccessFully :");
    console.log("GMP Api Hits SuccessFully :");
    console.log("Buyback Api Hits SuccessFully :");
    console.log("SME Api Hits SuccessFully :");

    // Combine the data
    const combinedData = {
      upcomingData: ipoResponse.data.upcomingIpos.slice(0,6),
      gmp: gmpResponse.data.gmp.slice(0,6),
      buyback: buybackResponse.data.buyback.slice(0,6),
      sme: smeResponse.data.smeData.slice(0,6),
    };

    // Send combined response
    res.json(combinedData);
  } catch (error) {
    console.error("Error fetching Additional Ipo Data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

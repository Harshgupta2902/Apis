const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  const [ipoResponse, gmpResponse, buybackResponse, smeResponse] =
    await Promise.all([
      axios.get("https://apis-iota-five.vercel.app/api/ipo"),
      axios.get("https://apis-iota-five.vercel.app/api/gmp"),
      // axios.get("https://apis-iota-five.vercel.app/api/buyback"),
      axios.get("https://apis-iota-five.vercel.app/api/sme"),
    ]);

  console.log("IPO Api Hits SuccessFully :");
  console.log("GMP Api Hits SuccessFully :");
  console.log("Buyback Api Hits SuccessFully :");
  console.log("SME Api Hits SuccessFully :");

  // Combine the data
  const combinedData = {
    upcomingData: Array.isArray(ipoResponse.data?.upcomingIpos)
      ? ipoResponse.data.upcomingIpos
      : [],
    gmp: Array.isArray(gmpResponse.data?.gmp) ? gmpResponse.data.gmp : [],
    buyback: Array.isArray(buybackResponse.data?.buyback)
      ? buybackResponse.data.buyback
      : [],
    sme: Array.isArray(smeResponse.data?.smeData)
      ? smeResponse.data.smeData
      : [],
  };

  const slugs = [
    ...combinedData.upcomingData.map((item) => item.slug),
    ...combinedData.gmp.map((item) => item.slug),
    ...combinedData.buyback.map((item) => item.slug),
    ...combinedData.sme.map((item) => item.slug),
  ].filter(
    (slug) => slug !== undefined && slug !== null && slug !== "undefined"
  );

  res.json(slugs);
});

module.exports = router;

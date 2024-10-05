const { db } = require("../firebase");
const express = require("express");
const router = express.Router();

// Route to get NAV data
router.get("/", async (req, res) => {
  try {
    const isin = await getIsin();
    if (isin) {
      res.json(isin);
    } else {
      res.status(404).json({ error: "Error Fetching ISIN's" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve ISIN" });
  }
});

const getIsin = async () => {
  try {
    const docRef = db.collection("mfscreener").doc("data");
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error("Document not found");
    }

    const docData = doc.data();
    const mutualFunds = docData.mutualFunds || [];
    const isinData = mutualFunds.map((fund) => fund.isin);
    console.log("ISIN data fetched successfully");
    return isinData;
  } catch (error) {
    console.error("Error fetching NAV data:", error);
    throw error;
  }
};

module.exports = router;

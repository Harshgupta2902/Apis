// nav.js
const db = require("../firebase");
const express = require("express");
const router = express.Router();

// Route to get NAV data
router.get("/:isin", async (req, res) => {
  const { isin } = req.params;
  if (!isin) {
    return res.status(400).json({ error: "ISIN parameter is required" });
  }
  try {
    const navData = await getNavData(isin);
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

const getNavData = async (isin) => {
  try {
    const docRef = db.collection("ISINs").doc(isin);
    const doc = await docRef.get();

    if (doc.exists) {
      return doc.data();
    } else {
      return { error: "No such ISIN Found" };
    }
  } catch (error) {
    console.error("Error fetching NAV data:", error);
    throw error;
  }
};

module.exports = router;

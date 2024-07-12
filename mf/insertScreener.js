// nav.js
const { db } = require("../firebase");
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const data = await fetchMfScreener();
    insertData(data);
  } catch (error) {
    console.error("Main process error:", error);
    res.status(500).send("Internal server error");
  }
});

const fetchMfScreener = async () => {
  try {
    const liveUrl = "https://ipo.onlineinfotech.net/Api/getMfData";
    const response = await axios.get(liveUrl);
    console.log(`fetchMfScreener fetched: ${response.data.length}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching", error);
    throw error;
  }
};

const insertData = async (data) => {
  try {
    const docRef = db.collection("mfscreener").doc("data");
    await docRef.set({ mutualFunds: data });
    console.log("Data successfully written to Firestore!");
  } catch (error) {
    console.error("Error writing document: ", error);
  }
};

module.exports = router;

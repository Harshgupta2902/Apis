const express = require("express");
const axios = require("axios");
const router = express.Router();

// Helper function to fetch data
const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

// Function to get mutual fund info
const getMfInfo = async (mf) => {
  return await fetchData(`https://api.tickertape.in/mutualfunds/${mf}/info`);
};

const getMfSummary = async (mf) => {
  return await fetchData(`https://api.tickertape.in/mutualfunds/${mf}/summary`);
};

const getMfFundManagers = async (mf) => {
  return await fetchData(
    `https://api.tickertape.in/mutualfunds/${mf}/fundmanagers`
  );
};

const getMfInvCheckList = async (mf) => {
  return await fetchData(
    `https://api.tickertape.in/mutualfunds/${mf}/investmentChecklists`
  );
};

router.get("/", async (req, res) => {
  const mf = req.query.mf;
  if (!mf) {
    return res.json(null);
  } else {
    const info = await getMfInfo(mf);
    const summary = await getMfSummary(mf);
    const fundManager = await getMfFundManagers(mf);
    const invChecklist = await getMfInvCheckList(mf);

    const data = {
      info: info.error ? { error: info.error } : info.data,
      summary: summary.error ? { error: summary.error } : summary.data,
      // fundmanager: fundManager.error
      //   ? { error: fundManager.error }
      //   : fundManager.data,
      inv_checkList: invChecklist.error
        ? { error: invChecklist.error }
        : invChecklist.data,
    };

    return res.json(data);
  }
});

module.exports = router;

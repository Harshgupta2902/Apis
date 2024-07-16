const express = require("express");
const axios = require("axios");
const router = express.Router();

const metadata = {
  "/": {
    title: "Main Page",
    description: "This is the Main page.",
    keywords: ["Main", "investment", "finance"],
  },
  "https://node.onlineinfotech.net/ipo/": {
    title: "IPO Page",
    description: "This is the IPO page.",
    keywords: ["ipo", "initial public offering", "stocks"],
  },

  "https://node.onlineinfotech.net/mutual-funds/": {
    title: "Mutual Fund Page",
    description: "This is Mutual Fund page.",
    keywords: ["Mutual Fund", "Mutual Fund", "example"],
  },
};

router.get("/", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).send("Error: 'url' query parameter is required");
    }

    if (url.includes("/mutual-funds/details")) {
      const fundSlug = url.split("/").pop();
      const MfFundCode = fundSlug.split("-").pop();

      const summary = await getMfSummary(MfFundCode);
      const meta = summary.data.meta;
      // Create SEO metadata
      const metaData = {
        title: `${meta.fullName} | Investment Details & Analysis`,
        description: `Explore the ${meta.fullName} (${meta.plan} Plan) with comprehensive details on performance, risk classification, benchmark index, and investment strategy. Invest wisely with ${meta.amc}.`,
        keywords: [
          meta.fullName,
          meta.sector,
          meta.subsector,
          meta.amc,
          meta.benchmarkIndex,
          "mutual fund investment",
          "high risk mutual funds",
          "debt and equity funds",
        ],
        canonical: url,
        og: {
          title: `${meta.fullName} | Investment Details & Analysis`,
          description: `Explore the ${meta.fullName} (${meta.plan} Plan) with comprehensive details on performance, risk classification, benchmark index, and investment strategy. Invest wisely with ${meta.amc}.`,
          url: url,
          type: "website",
          image: "URL_TO_FUND_IMAGE", // Replace with actual image URL
        },
        twitter: {
          card: "summary_large_image",
          title: `${meta.fullName} | Investment Details & Analysis`,
          description: `Explore the ${meta.fullName} (${meta.plan} Plan) with comprehensive details on performance, risk classification, benchmark index, and investment strategy. Invest wisely with ${meta.amc}.`,
          image: "URL_TO_FUND_IMAGE", // Replace with actual image URL
        },
        additionalMetaTags: [
          { name: "author", content: meta.amc },
          { name: "robots", content: "index, follow" },
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
        ],
      };
      return res.status(200).json(metaData);
    }
    const pageMetadata = metadata[url];

    if (!pageMetadata) {
      return res
        .status(404)
        .send("Error: Metadata not found for the provided URL");
    }

    res.status(200).json(pageMetadata);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

const fetchData = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

const getMfSummary = async (mf) => {
  return await fetchData(`https://api.tickertape.in/mutualfunds/${mf}/summary`);
};

module.exports = router;

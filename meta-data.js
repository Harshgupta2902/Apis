const express = require("express");

const router = express.Router();

const metadata = {
  "https://node.onlineinfotech.net/": {
    title: "Mutual Fund Page",
    description: "This is the Mutual Fund page.",
    keywords: ["mutual fund", "investment", "finance"],
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

module.exports = router;

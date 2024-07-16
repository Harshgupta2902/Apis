const express = require("express");
const axios = require("axios");
const router = express.Router();
const cheerio = require("cheerio");

const domain = "https://node.onlineinfotech.net";

const metadata = {
  "/": {
    title: "Explore IpoTech | Recents Ipo, Mutual Funds, and Financial Tools",
    description:
      "Explore stocks, direct mutual funds, Mainboard IPOs, SME IPOs, and financial tools like calculators at IpoTech. Discover comprehensive data and insights for informed investing decisions.",
    keywords: [
      "upcoming ipo",
      "ipo",
      "pre ipo investing",
      "upcoming ipos",
      "new ipo stocks",
      "new ipo",
      "ipos this week",
      "upcoming ipos 2024",
      "best ipo stocks",
    ],
    canonical: domain,
    og: {
      title: "Explore IpoTech | Recents Ipo, Mutual Funds, and Financial Tools",
      description:
        "Explore stocks, direct mutual funds, Mainboard IPOs, SME IPOs, and financial tools like calculators at IpoTech. Discover comprehensive data and insights for informed investing decisions.",
      url: domain,
      type: "Ipo",
      image: "",
    },
    twitter: {
      card: "",
      title: "Explore IpoTech | Recents Ipo, Mutual Funds, and Financial Tools",
      description:
        "Explore stocks, direct mutual funds, Mainboard IPOs, SME IPOs, and financial tools like calculators at IpoTech. Discover comprehensive data and insights for informed investing decisions.",
      image: "",
    },
    additionalMetaTags: [
      { name: "author", content: "IpoTech" },
      { name: "robots", content: "index, follow" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
    ],
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
        canonical: `${url}`,
        og: {
          title: `${meta.fullName} | Investment Details & Analysis`,
          description: `Explore the ${meta.fullName} (${meta.plan} Plan) with comprehensive details on performance, risk classification, benchmark index, and investment strategy. Invest wisely with ${meta.amc}.`,
          url: `${url}`,
          type: "Mutual Funds",
          image: "", // Replace with actual image URL
        },
        twitter: {
          card: "",
          title: `${meta.fullName} | Investment Details & Analysis`,
          description: `Explore the ${meta.fullName} (${meta.plan} Plan) with comprehensive details on performance, risk classification, benchmark index, and investment strategy. Invest wisely with ${meta.amc}.`,
          image: "", // Replace with actual image URL
        },
        additionalMetaTags: [
          { name: "author", content: "IpoTech" },
          { name: "robots", content: "index, follow" },
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
        ],
      };
      return res.status(200).json(metaData);
    }

    if (url.includes("/ipo/details")) {
      const ipoSlug = url.split("/").pop();

      const response = await axios.get(`https://ipowatch.in/${ipoSlug}`);
      const html = response.data;
      const $ = cheerio.load(html);

      const metaData = {
        title: $("title").text().trim(),
        description: $("meta[name='description']").attr("content"),
        keywords: $("meta[name='keywords']").attr("content"),
        canonical: url,
        og: {
          title: $("title").text().trim(),
          description: $("meta[name='description']").attr("content"),
          url: url,
          type: "Ipo",
          image: $("meta[property='og:image']").attr("content"),
        },
        twitter: {
          card: $("meta[name='twitter:card']").attr("content"),
          title: $("title").text().trim(),
          description: $("meta[name='description']").attr("content"),
          image: $("meta[name='twitter:image']").attr("content"),
        },
        additionalMetaTags: [
          { name: "author", content: "IpoTech" },
          { name: "robots", content: "index, follow" },
          {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0",
          },
        ],
      };
      replaceIPOWatchWithIpoTech(metaData);

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

const replaceIPOWatchWithIpoTech = (metaData) => {
  // Replace occurrences of "IPO Watch" with "IpoTech"
  if (metaData.title) {
    metaData.title = metaData.title.replace(/IPO Watch/gi, "IpoTech");
  }
  if (metaData.description) {
    metaData.description = metaData.description.replace(
      /IPO Watch/gi,
      "IpoTech"
    );
  }
  if (metaData.keywords) {
    metaData.keywords = metaData.keywords.map((keyword) =>
      keyword.replace(/IPO Watch/gi, "IpoTech")
    );
  }
  if (metaData.og && metaData.og.title) {
    metaData.og.title = metaData.og.title.replace(/IPO Watch/gi, "IpoTech");
  }
  if (metaData.og && metaData.og.description) {
    metaData.og.description = metaData.og.description.replace(
      /IPO Watch/gi,
      "IpoTech"
    );
  }
  if (metaData.twitter && metaData.twitter.title) {
    metaData.twitter.title = metaData.twitter.title.replace(
      /IPO Watch/gi,
      "IpoTech"
    );
  }
  if (metaData.twitter && metaData.twitter.description) {
    metaData.twitter.description = metaData.twitter.description.replace(
      /IPO Watch/gi,
      "IpoTech"
    );
  }
};

const getMfSummary = async (mf) => {
  return await fetchData(`https://api.tickertape.in/mutualfunds/${mf}/summary`);
};

const formatString = (inputString) => {
  const formattedString = inputString.replace(/-/g, " ");
  const capitalizedString =
    formattedString.charAt(0).toUpperCase() + formattedString.slice(1);
  return capitalizedString;
};

module.exports = router;

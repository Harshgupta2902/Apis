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
    ],
  },

  "/ipo": {
    title: "Discover Mainboard and Upcoming Ipos | IpoTech",
    description:
      "Explore upcoming IPOs and Mainboard listings on IpoTech. Stay ahead in the market with the latest IPO news and updates. Discover opportunities now!",
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
    canonical: `${domain}/ipo`,
    og: {
      title: "Discover Mainboard and Upcoming Ipos | IpoTech",
      description:
        "Explore upcoming IPOs and Mainboard listings on IpoTech. Stay ahead in the market with the latest IPO news and updates. Discover opportunities now!",
      url: `${domain}/ipo`,
      type: "Ipo",
      image: "",
    },
    twitter: {
      card: "",
      title: "Discover Mainboard and Upcoming Ipos | IpoTech",
      description:
        "Explore upcoming IPOs and Mainboard listings on IpoTech. Stay ahead in the market with the latest IPO news and updates. Discover opportunities now!",
      image: "",
    },
    additionalMetaTags: [
      { name: "author", content: "IpoTech" },
      { name: "robots", content: "index, follow" },
    ],
  },

  "/ipo/upcomingIpo": {
    title: "Discover Mainboard and Upcoming Ipos | IpoTech",
    description:
      "Explore upcoming IPOs and Mainboard listings on IpoTech. Stay ahead in the market with the latest IPO news and updates. Discover opportunities now!",
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
    canonical: `${domain}/ipo/upcomingIpo`,
    og: {
      title: "Discover Mainboard and Upcoming Ipos | IpoTech",
      description:
        "Explore upcoming IPOs and Mainboard listings on IpoTech. Stay ahead in the market with the latest IPO news and updates. Discover opportunities now!",
      url: `${domain}/ipo/upcomingIpo`,
      type: "Ipo",
      image: "",
    },
    twitter: {
      card: "",
      title: "Discover Mainboard and Upcoming Ipos | IpoTech",
      description:
        "Explore upcoming IPOs and Mainboard listings on IpoTech. Stay ahead in the market with the latest IPO news and updates. Discover opportunities now!",
      image: "",
    },
    additionalMetaTags: [
      { name: "author", content: "IpoTech" },
      { name: "robots", content: "index, follow" },
    ],
  },

  "/ipo/greyMarketIpo": {
    title: "Live Grey Market Premium of IPOs | IpoTech",
    description:
      "Real-time IPO Grey Market Premiums at your fingertips. Stay informed, stay ahead. Evaluate IPOs with accurate market pricing data today!",
    keywords: [
      "gmp",
      "ipo",
      "grey market premium",
      "cgmp",
      "ipo investment",
      "new ipo stocks",
      "new ipo",
      "ipos this week",
      "upcoming ipos 2024",
      "best ipo stocks",
    ],
    canonical: `${domain}/ipo/greyMarketIpo`,
    og: {
      title: "Live Grey Market Premium of IPOs | IpoTech",
      description:
        "Real-time IPO Grey Market Premiums at your fingertips. Stay informed, stay ahead. Evaluate IPOs with accurate market pricing data today!",
      url: `${domain}/ipo/greyMarketIpo`,
      type: "Ipo",
      image: "",
    },
    twitter: {
      card: "",
      title: "Live Grey Market Premium of IPOs | IpoTech",
      description:
        "Real-time IPO Grey Market Premiums at your fingertips. Stay informed, stay ahead. Evaluate IPOs with accurate market pricing data today!",
      image: "",
    },
    additionalMetaTags: [
      { name: "author", content: "IpoTech" },
      { name: "robots", content: "index, follow" },
    ],
  },

  "/ipo/smeMarketIpo": {
    title: "Expert Advice on SME IPO Applications | IpoTech",
    description:
      "Discover the latest IPO details for Small and Medium-sized Enterprises (SME) on our website, providing valuable insights for investors",
    keywords: [
      "sme ipo",
      "sme",
      "ipo",
      "sme loans",
      "sme business loan",
      "ipo stocks",
      "upcoming ipos",
      "pre ipo",
      "new ipo",
      "nse sme ipo",
    ],
    canonical: `${domain}/ipo/smeMarketIpo`,
    og: {
      title: "Expert Advice on SME IPO Applications | IpoTech",
      description:
        "Discover the latest IPO details for Small and Medium-sized Enterprises (SME) on our website, providing valuable insights for investors",
      url: `${domain}/ipo/smeMarketIpo`,
      type: "Ipo",
      image: "",
    },
    twitter: {
      card: "",
      title: "Expert Advice on SME IPO Applications | IpoTech",
      description:
        "Discover the latest IPO details for Small and Medium-sized Enterprises (SME) on our website, providing valuable insights for investors",
      image: "",
    },
    additionalMetaTags: [
      { name: "author", content: "IpoTech" },
      { name: "robots", content: "index, follow" },
    ],
  },

  "/ipo/subscriptionStatus": {
    title: "IPO Subscription Status - Live from BSE and NSE 2024 | IpoTech",
    description:
      "The IPO subscription live status of IPO in 2024. Check how many times Mainboard IPO over-subscribed in QIB, NII and Retail category at BSE, NSE in real-time",
    keywords: [
      "ipo subscription status",
      "ipo subscription",
      "subscription of ipo",
      "subscribe",
      "pre ipo investing",
    ],
    canonical: `${domain}/ipo/subscriptionStatus`,
    og: {
      title: "IPO Subscription Status - Live from BSE and NSE 2024 | IpoTech",
      description:
        "The IPO subscription live status of IPO in 2024. Check how many times Mainboard IPO over-subscribed in QIB, NII and Retail category at BSE, NSE in real-time",
      url: `${domain}/ipo/subscriptionStatus`,
      type: "Ipo",
      image: "",
    },
    twitter: {
      card: "",
      title: "IPO Subscription Status - Live from BSE and NSE 2024 | IpoTech",
      description:
        "The IPO subscription live status of IPO in 2024. Check how many times Mainboard IPO over-subscribed in QIB, NII and Retail category at BSE, NSE in real-time",
      image: "",
    },
    additionalMetaTags: [
      { name: "author", content: "IpoTech" },
      { name: "robots", content: "index, follow" },
    ],
  },

  "/ipo/ipoForms": {
    title: "IPO Forms, Download ASBA IPO Forms, BSE & NSE IPO Forms | IpoTech",
    description:
      "IPO Forms - Download Mainline IPO and SME IPO forms online. NSE IPO form & BSE IPO form PDF for IPO Application is available for download online",
    keywords: ["ipo forms", "forms", "download forms", "ipo forms download"],
    canonical: `${domain}/ipo/ipoForms`,
    og: {
      title:
        "IPO Forms, Download ASBA IPO Forms, BSE & NSE IPO Forms | IpoTech",
      description:
        "IPO Forms - Download Mainline IPO and SME IPO forms online. NSE IPO form & BSE IPO form PDF for IPO Application is available for download online",
      url: `${domain}/ipo/ipoForms`,
      type: "Ipo",
      image: "",
    },
    twitter: {
      card: "",
      title:
        "IPO Forms, Download ASBA IPO Forms, BSE & NSE IPO Forms | IpoTech",
      description:
        "IPO Forms - Download Mainline IPO and SME IPO forms online. NSE IPO form & BSE IPO form PDF for IPO Application is available for download online",
      image: "",
    },
    additionalMetaTags: [
      { name: "author", content: "IpoTech" },
      { name: "robots", content: "index, follow" },
    ],
  },

  "/ipo/sharesBuyBack": {
    title: "Upcoming Buyback 2024, Latest Buyback of Shares in India | IpoTech",
    description:
      "Share Buyback 2024 - Find the latest share Buyback 2024 offers from the companies with record dates, prices, buyback types and more details ",
    keywords: [
      "shares buyback",
      "ipo",
      "ipo shares buyback",
      "buyback of shares",
      "buyback share",
      "share buyback",
      "buyback",
    ],
    canonical: `${domain}/ipo/sharesBuyBack`,
    og: {
      title:
        "Upcoming Buyback 2024, Latest Buyback of Shares in India | IpoTech",
      description:
        "Share Buyback 2024 - Find the latest share Buyback 2024 offers from the companies with record dates, prices, buyback types and more details ",
      url: `${domain}/ipo/sharesBuyBack`,
      type: "Ipo",
      image: "",
    },
    twitter: {
      card: "",
      title:
        "Upcoming Buyback 2024, Latest Buyback of Shares in India | IpoTech",
      description:
        "Share Buyback 2024 - Find the latest share Buyback 2024 offers from the companies with record dates, prices, buyback types and more details ",
      image: "",
    },
    additionalMetaTags: [
      { name: "author", content: "IpoTech" },
      { name: "robots", content: "index, follow" },
    ],
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

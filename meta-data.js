const express = require("express");
const axios = require("axios");
const router = express.Router();
const cheerio = require("cheerio");

const metadata = {
  "/": {
    title: "Explore Recents Ipo, Mutual Funds, and Financial Tools | IpoTech ",
    description:
      "Looking for stocks, mutual funds, IPOs, and calculators? IpoTech provides the data and insights you need to invest wisely. Start exploring now.",
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
  },

  "/ipo/ipoForms": {
    title:
      "IPO Forms, Download ASBA IPO Forms, BSE and NSE IPO Forms | IpoTech",
    description:
      "IPO Forms - Download Mainline IPO and SME IPO forms online. NSE IPO form & BSE IPO form PDF for IPO Application is available for download online",
    keywords: ["ipo forms", "forms", "download forms", "ipo forms download"],
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
  },

  "/mutual-funds": {
    title: "Top Mutual Funds: Smart Investing for Your Future | IpoTech",
    description:
      "Explore the best mutual funds to grow your savings. Unlock expert insights for smarter investment choices. Invest in your future now!",
    keywords: [
      "mutual funds",
      "stock vs mutual funds",
      "mutual fund calculator",
      "best mutual funds",
      "Indian stock market",
      "mutual fund analysis tool",
      "research tool",
      "debt funds",
      "hybrid funds",
    ],
  },

  "/mutual-funds/screener": {
    title:
      "Explore the Top Mutual Funds: Find the Best Picks Using Our Screening Tool | IpoTech",
    description:
      "Explore high-performing mutual funds using our advanced screening tool. Utilize filters, conduct comparisons, and confidently make investment choices today!",
    keywords: [
      "mutual funds",
      "stock vs mutual funds",
      "best mutual funds",
      "research tool",
      "debt funds",
      "hybrid funds",
      "growth funds",
      "screener tools",
    ],
  },

  "/calculators/sip_calculator": {
    title: "SIP Calculator : Systematic Investment Plan | IpoTech",
    description:
      "A SIP calculator helps investors estimate potential returns on their systematic investment plan by inputting investment amount, expected rate of return, and tenure. This tool aids in making informed decisions and setting realistic financial goals for long-term growth!",
    keywords: [
      "sip calculator",
      "mutual fund sip calculator",
      "sip calculator sbi",
      "mf sip calculator",
      "calculators",
      "investment calculators",
      "screener tools",
    ],
  },

  "/calculators/lumpsum_calculator": {
    title: "Lumpsum Calculator: Quick & Easy Investment Planning | IpoTech",
    description:
      "Need help with investment planning? Use our easy Lumpsum Calculator for fast calculations and smart financial decisions. Start now!",
    keywords: [
      "lumpsum calculator",
      "mutual fund lumpsum calculator",
      "lumpsum calculator sbi",
      "mf lumpsum calculator",
      "calculators",
      "investment calculators",
      "screener tools",
    ],
  },

  "/calculators/swp_calculator": {
    title: "SWP Calculator: Maximize Investment Returns Easily | IpoTech",
    description:
      "Want to boost your investment returns? Our SWP calculator makes it simple to plan withdrawals. Get started and optimize your strategy today!",
    keywords: [
      "swp calculator",
      "mutual fund swp calculator",
      "swp calculator sbi",
      "mf swp calculator",
      "calculators",
      "investment calculators",
      "screener tools",
    ],
  },
};

router.get("/", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).send({ error: "URL is required" });
    }
    if (url.includes("undefined")) {
      res
        .status(500)
        .send({ error: `Metadata not found for the provided URL` });
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
      };
      replaceIPOWatchWithIpoTech(metaData);

      return res.status(200).json(metaData);
    }

    const pageMetadata = metadata[url];

    if (!pageMetadata) {
      return res
        .status(404)
        .send({ error: `Metadata not found for the provided URL` });
    }

    res.status(200).json(pageMetadata);
  } catch (error) {
    res.status(500).send({ error: `Metadata not found for the provided URL` });
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


module.exports = router;

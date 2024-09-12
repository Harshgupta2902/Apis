const express = require("express");
const axios = require("axios");
const router = express.Router();
const cheerio = require("cheerio");

const metadata = {
  "/": {
    title: "Explore Recents Ipo, Mutual Funds, and Financial Tools | IpoTec ",
    description:
      "Looking for stocks, mutual funds, IPOs, and calculators? IpoTec provides the data and insights you need to invest wisely. Start exploring now.",
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
    title: "Discover Mainboard and Upcoming Ipos | IpoTec",
    description:
      "Explore upcoming IPOs and Mainboard listings on IpoTec. Stay ahead in the market with the latest IPO news and updates. Discover opportunities now!",
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
    title: "Discover Mainboard and Upcoming Ipos | IpoTec",
    description:
      "Explore upcoming IPOs and Mainboard listings on IpoTec. Stay ahead in the market with the latest IPO news and updates. Discover opportunities now!",
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
    title: "Live Grey Market Premium of IPOs | IpoTec",
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
    title: "Expert Advice on SME IPO Applications | IpoTec",
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
    title: "IPO Subscription Status - Live from BSE and NSE 2024 | IpoTec",
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
    title: "IPO Forms, Download ASBA IPO Forms, BSE and NSE IPO Forms | IpoTec",
    description:
      "IPO Forms - Download Mainline IPO and SME IPO forms online. NSE IPO form & BSE IPO form PDF for IPO Application is available for download online",
    keywords: ["ipo forms", "forms", "download forms", "ipo forms download"],
  },

  "/ipo/sharesBuyBack": {
    title: "Upcoming Buyback 2024, Latest Buyback of Shares in India | IpoTec",
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

  "/mutualfunds": {
    title: "Top Mutual Funds: Smart Investing for Your Future | IpoTec",
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

  "/mutualfunds/screener": {
    title:
      "Explore the Top Mutual Funds: Find the Best Picks Using Our Screening Tool | IpoTec",
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

  "/mutualfunds/amc": {
    title: "Latest MF Schemes, NAV, Performance & Returns | IpoTec",
    description:
      "Read all about Asset Management Companies (AMCs), their governing bodies, and discover the top Mutual Funds companies in India at IpoTec",
    keywords: [
      "mutual funds",
      "amc page",
      "ipotec",
      "ipotec amc",
      "Top AMC",
      "latest amc ",
      "growth funds",
    ],
  },

  "/mutualfunds/category": {
    title: "List of Mutual Funds Categories | IpoTec",
    description:
      "List of Mutual Funds Categories. Find the complete details of catergorization - IpoTec",
    keywords: [
      "mutual funds",
      "amc page",
      "category",
      "ipotec mf",
      "ipotec amc",
      "Top Funds",
      "latest amc",
    ],
  },

  "/calculators": {
    title: "Invest in Your Future: Finance Smart, Grow Wealth | IpoTec",
    description:
      "Tools & Calculators: Plan smarter with our financial tools. Invest, save, and achieve your goals with insights to grow wealth and secure your future",
    keywords: [
      "Financial calculators",
      "Investment planning",
      "Wealth management",
      "Savings calculator",
      "Retirement planning",
      "Future planning tools",
      "Smart investing",
      "Financial planning tools",
      "Personal finance",
      "Grow wealth",
      "Financial security",
      "Budgeting tools",
      "Online calculators",
      "Investment growth",
      "Financial insights",
    ],
  },

  "/calculators/sip_calculator": {
    title: "SIP Calculator : Systematic Investment Plan | IpoTec",
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
    title: "Lumpsum Calculator: Quick & Easy Investment Planning | IpoTec",
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
    title: "SWP Calculator: Maximize Investment Returns Easily | IpoTec",
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

  "/blogs": {
    title: "Explore the Latest Insights on IPOs and Mutual Funds | IpoTec",
    description:
      "Discover expert analysis, news, and trends in IPOs, mutual funds, and related topics. Stay informed with in-depth articles and updates on IPO launches, mutual funds NFO's, and emerging market trends",
    keywords: [
      "crypto blogs",
      "bitcoin blogs",
      "ipo blogs",
      "ipo",
      "nfo",
      "investments",
      "mutual funds",
      "market",
      "trending blogs",
      "groww",
      "grow",
    ],
  },
  "/mutualfunds/nfo": {
    title: "Explore NFO Funds | IpoTec",
    description:
      "Find upcoming NFOs, details on closed offers, and essential updates to make informed investment decisions",
    keywords: [
      "Upcoming NFOs",
      "Closed NFO details",
      "Investment updates",
      "Live NFOs",
      "NFO information",
      "Investment decisions",
      "Financial updates",
    ],
  },
  "/ifsc-code": {
    title: "IpoTec IFSC Details Finder",
    description:
      "Enter IFSC Code and get your Bank Details for that IFSC Code, BRANCH, MICR Code, Branch Code, Address, and Phone Number for NEFT, RTGS, ECS",
    keywords: ["IFSC Code", "IFSC code finder", "ifsc detials", "bank details"],
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

const replaceIPOWatchWithIpoTech = (metaData) => {
  if (metaData.title) {
    metaData.title = metaData.title.replace(/IPO Watch/gi, "IpoTec");
  }
  if (metaData.description) {
    metaData.description = metaData.description.replace(
      /IPO Watch/gi,
      "IpoTec"
    );
  }
  if (metaData.keywords) {
    metaData.keywords = metaData.keywords.map((keyword) =>
      keyword.replace(/IPO Watch/gi, "IpoTec")
    );
  }
  if (metaData.og && metaData.og.title) {
    metaData.og.title = metaData.og.title.replace(/IPO Watch/gi, "IpoTec");
  }
  if (metaData.og && metaData.og.description) {
    metaData.og.description = metaData.og.description.replace(
      /IPO Watch/gi,
      "IpoTec"
    );
  }
  if (metaData.twitter && metaData.twitter.title) {
    metaData.twitter.title = metaData.twitter.title.replace(
      /IPO Watch/gi,
      "IpoTec"
    );
  }
  if (metaData.twitter && metaData.twitter.description) {
    metaData.twitter.description = metaData.twitter.description.replace(
      /IPO Watch/gi,
      "IpoTec"
    );
  }
};

module.exports = router;

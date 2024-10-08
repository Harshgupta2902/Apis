const puppeteer = require("puppeteer");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const express = require("express");
const router = express.Router();

// // Puppeteer function to scrape the price
// const scrapePrice = async () => {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto("https://in.tradingview.com/symbols/NSE-HDFCBANK/");
//   await page.waitForSelector(".last-JWoJqCpY.js-symbol-last");

//   const priceContainer = await page.$(".last-JWoJqCpY.js-symbol-last");
//   const price = await priceContainer.evaluate((el) => el.textContent);
//   console.log(price);
//   return price;
// };

// // Route to get the price data
router.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://in.tradingview.com/symbols/NSE-HDFCBANK/");
    await page.waitForSelector(".last-JWoJqCpY.js-symbol-last");
    const scrapePrice = async () => {
      try {
        const priceContainer = await page.$(".last-JWoJqCpY.js-symbol-last");
        const price = await priceContainer.evaluate((el) => el.textContent);
        console.log("Current BTC/USD Price:", price);
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(price);
          }
        });
      } catch (err) {
        console.error("Error scraping price:", err);
      }
    };
    setInterval(scrapePrice, 500);
  } catch (err) {
    res.status(500).json({ error: "Error fetching the price" });
  }
});

module.exports = router;

const puppeteer = require("puppeteer");
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Go to the TradingView BTC/USD page
  await page.goto(
    "https://in.tradingview.com/symbols/NSE-HDFCBANK/"
  );

  // Wait for the price span element to be available
  await page.waitForSelector(".last-JWoJqCpY.js-symbol-last");

  // Function to scrape the price
  const scrapePrice = async () => {
    try {
      // Select the entire parent span
      const priceContainer = await page.$(".last-JWoJqCpY.js-symbol-last");

      // Extract text from the parent span and all nested spans
      const price = await priceContainer.evaluate((el) => el.textContent);

      console.log("Current BTC/USD Price:", price);

      // Send the price to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(price);
        }
      });
    } catch (err) {
      console.error("Error scraping price:", err);
    }
  };

  // Scrape the price every 500 milliseconds
  setInterval(scrapePrice, 500);
})();

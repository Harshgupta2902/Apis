// buyback.js

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { generateSlugFromUrl } = require("../utils");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const url = "https://ipowatch.in/share-buyback-offers/";
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const buyback = [];

    const table = $("table").first();
    table.find("tbody tr").each((i, row) => {
      const rowData = {};
      $(row)
        .find("td")
        .each((j, cell) => {
          const anchor = $(cell).find("a");
          if (anchor.length > 0) {
            const anchorText = anchor.text().trim();
            const anchorLink = anchor.attr("href").trim();
            rowData[`Column_${j + 1}`] = anchorText;
            rowData["link"] = anchorLink == null ? null : anchorLink;
          } else {
            rowData[`Column_${j + 1}`] = $(cell).text().trim();
          }
        });
      const formattedTable = {
        company_name: rowData["Column_1"],
        date: rowData["Column_2"],
        open: rowData["Column_3"],
        close: rowData["Column_4"],
        price: rowData["Column_5"],
        link: rowData["link"],
        slug: generateSlugFromUrl(`${rowData["link"]}`),
      };
      buyback.push(formattedTable);
    });
    buyback.shift();
    res.json({ buyback }); // Exclude header row
  } catch (error) {
    console.error("Error fetching buyback offers data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

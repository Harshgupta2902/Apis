const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const { formatDate } = require("../utils");
const router = express.Router();

const url =
  "https://www.chittorgarh.com/report/latest-buyback-issues-in-india/80/tender-and-open-market-buyback/?year=2024";

router.get("/", async (req, res) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const rows = $("table tbody tr");
    const buyback = [];
    rows.each((index, row) => {
      const columns = $(row).find("td");
      const companyName = $(columns[0]).text().trim();

      if (!companyName.includes("googletag.cmd.push")) {
        const rowData = {
          companyName,
          recordDate: formatDate($(columns[1]).text().trim()),
          issueOpen: formatDate($(columns[2]).text().trim()),
          issueClose: formatDate($(columns[3]).text().trim()),
          buybackType: $(columns[4]).text().trim() || "-",
          buybackPrice: $(columns[5]).text().trim() || "-",
          currentMarketPrice: $(columns[6]).text().trim() || "-",
          issueSizeShares: $(columns[7]).text().trim() || "-",
          issueSizeAmount: $(columns[8]).text().trim() || "-",
        };
        buyback.push(rowData);
      }
    });
    res.json({ buyback });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

module.exports = router;

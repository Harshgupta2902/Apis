const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const router = express.Router();

const url =
  "https://www.chittorgarh.com/report/latest-buyback-issues-in-india/80/tender-and-open-market-buyback/?year=2024";

router.get("/", async (req, res) => {
  try {
    // Fetch the HTML from the URL
    const { data } = await axios.get(url);

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Select the table rows
    const rows = $("table tbody tr");

    // Extract data from each row
    const tableData = [];

    rows.each((index, row) => {
      const columns = $(row).find("td");
      const companyName = $(columns[0]).text().trim();

      if (!companyName.includes("googletag.cmd.push")) {
        const rowData = {
          companyName,
          recordDate: $(columns[1]).text().trim(),
          issueOpen: $(columns[2]).text().trim(),
          issueClose: $(columns[3]).text().trim(),
          buybackType: $(columns[4]).text().trim(),
          buybackPrice: $(columns[5]).text().trim(),
          currentMarketPrice: $(columns[6]).text().trim(),
          issueSizeShares: $(columns[7]).text().trim(),
          issueSizeAmount: $(columns[8]).text().trim(),
        };
        tableData.push(rowData);
      }
    });
    res.json(tableData);
    console.log(tableData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

module.exports = router;

// forms.js

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { generateSlugFromUrl, sortEntriesByDate } = require("../utils");

const router = express.Router();

// Define route to fetch data
router.get("/", async (req, res) => {
  try {
    const url =
      "https://ipowatch.in/ipo-forms-download-ipo-application-asba-form/";
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const table = $("table");
    const formsData = [];
    const headers = [];

    // Extract headers
    table
      .find("tr")
      .first()
      .find("th")
      .each((index, element) => {
        headers.push($(element).text().trim());
      });

    table.find("tr").each((rowIndex, row) => {
      if (rowIndex === 0) {
        return;
      }
      const rowData = [];
      $(row)
        .find("td")
        .each((colIndex, column) => {
          const cellText = $(column).text().trim();
          rowData.push(cellText);
          const anchorLink = $(column).find("a").attr("href");
          const finalCellText = anchorLink ? anchorLink : null;
          rowData.push(finalCellText);
        });
      const formattedTable = {
        company_name: rowData[0],
        date: rowData[2],
        date_link: rowData[3],
        bse: rowData[4],
        bse_link: rowData[5],
        nse: rowData[6],
        nse_link: rowData[7],
        link: rowData[1],
        slug: generateSlugFromUrl(`${rowData[1]}`),
      };
      formsData.push(formattedTable);
    });

    const forms = sortEntriesByDate(formsData);

    res.json({ forms });
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

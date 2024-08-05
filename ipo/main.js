// fetchIPOData.js

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { generateSlugFromUrl } = require("../utils");

const router = express.Router();

router.get("/", async (req, res) => {
  const time = req.query.time;

  try {
    const url = "https://ipowatch.in";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const upcomingData = extractTableData($, $("#tablepress-1"), "Upcoming");
    const smeData = extractTableData($, $("#tablepress-2"), "SME");
    const now = new Date();
    const timestamp = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()} ${String(now.getHours()).padStart(
      2,
      "0"
    )}:${String(now.getMinutes()).padStart(2, "0")}:${String(
      now.getSeconds()
    ).padStart(2, "0")}`;

    res.json({ upcomingData, timestamp, time });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function extractTableData($, table, type) {
  const headers = [];
  const rows = [];

  // Extract headers
  table.find("thead tr th").each((i, el) => {
    headers.push($(el).text().trim());
  });

  // Extract rows
  table.find("tbody tr").each((i, row) => {
    const rowData = { Type: type };
    $(row)
      .find("td")
      .each((j, cell) => {
        // Check if the cell contains an anchor tag
        const anchor = $(cell).find("a");
        if (anchor.length > 0) {
          const anchorText = anchor.text().trim();
          const anchorLink = anchor.attr("href").trim();
          rowData[headers[j]] = anchorText;
          rowData["link"] = anchorLink;
          rowData["slug"] = generateSlugFromUrl(anchorLink);
        } else {
          rowData[headers[j]] = $(cell).text().trim();
        }
      });

    // Change keys as needed
    const formattedRow = {
      Type: rowData["Type"],
      company_name: rowData["Company"],
      open: rowData["Open"],
      close: rowData["Close"],
      link: rowData["link"],
      slug: rowData["slug"],
    };

    rows.push(formattedRow);
  });

  return rows;
}

module.exports = router;

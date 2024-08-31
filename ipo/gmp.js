// gmp.js

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { generateSlugFromUrl } = require("../utils");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const url = "https://ipowatch.in/ipo-grey-market-premium-latest-ipo-gmp/";
    const response = await axios.get(url);

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const figureContainer = $("figure.wp-block-table").first();
      const table = figureContainer.find("table");

      const gmp = [];
      const oldGmp = [];

      const headers = [];
      table
        .find("tr")
        .first()
        .find("td")
        .each((index, column) => {
          headers.push($(column).text().trim().toLowerCase());
        });

      table
        .find("tr")
        .slice(1)
        .each((index, row) => {
          const rowData = {};
          $(row)
            .find("td")
            .each((index, column) => {
              const header = headers[index].toLowerCase(); // Assuming headers are normalized to lowercase
              const anchor = $(column).find("a");

              if (anchor.length > 0) {
                const anchorText = anchor.text().trim();
                const anchorLink = anchor.attr("href").trim();
                rowData[header] = {
                  text: anchorText,
                  link: anchorLink,
                };
              } else {
                rowData[header] = $(column).text().trim();
              }
            });

          // Safeguard check
          const companyNameObj = rowData["company"];
          if (companyNameObj && typeof companyNameObj === "object") {
            const formattedTable = {
              company_name: companyNameObj.text || "N/A",
              link: companyNameObj.link || "#",
              type: rowData["type"] || "N/A",
              ipo_gmp: rowData["ipo gmp"] || "N/A",
              price: rowData["price"] || "N/A",
              gain: rowData["gain"] || "N/A",
              date: rowData["date"] || "N/A",
              slug: generateSlugFromUrl(companyNameObj.link || "#"),
            };
            gmp.push(formattedTable);
          } else {
            console.error("IPO Name is missing or incorrect", rowData);
          }
        });

      const additionalTable = $("figure.wp-block-table").eq(1).find("table");
      const additionalHeaders = [];
      additionalTable
        .find("tr")
        .first()
        .find("td")
        .each((index, column) => {
          additionalHeaders.push($(column).text().trim().toLowerCase());
        });

      // Process rows of the additional table
      additionalTable
        .find("tr")
        .slice(1)
        .each((index, row) => {
          const rowData = {};
          $(row)
            .find("td")
            .each((index, column) => {
              const header = additionalHeaders[index].toLowerCase();
              const anchor = $(column).find("a");
              if (anchor.length > 0) {
                const anchorText = anchor.text().trim();
                const anchorLink = anchor.attr("href").trim();
                rowData[header] = {
                  text: anchorText,
                  link: anchorLink,
                };
              } else {
                rowData[header] = $(column).text().trim();
              }
            });

          // Safeguard checks
          const companyNameObj = rowData["company"];
          if (companyNameObj && typeof companyNameObj === "object") {
            const formattedTable = {
              company_name: companyNameObj.text || "N/A",
              price: rowData["price"] || "N/A",
              ipo_gmp: rowData["ipo gmp"] || "N/A",
              listed: rowData["listed"] || "N/A",
              link: companyNameObj.link || "#",
              slug: generateSlugFromUrl(companyNameObj.link || "#"),
            };
            oldGmp.push(formattedTable);
          } else {
            console.error("IPO Name is missing or incorrect", rowData);
          }
        });
      res.json({ gmp, oldGmp });
    } else {
      throw new Error("Failed to fetch the page");
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

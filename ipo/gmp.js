// gmp.js

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { generateSlugFromUrl, sortEntriesByDate } = require("../utils");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const url = "https://ipowatch.in/ipo-grey-market-premium-latest-ipo-gmp/";
    const response = await axios.get(url);

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const figureContainer = $("figure.wp-block-table").first();
      const table = figureContainer.find("table");

      const Gmp = [];
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
              const header = headers[index].toLowerCase();
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
          const companyNameObj = rowData["upcoming ipo"];
          if (companyNameObj && typeof companyNameObj === "object") {
            const formattedTable = {
              company_name: companyNameObj.text || "N/A",
              link: companyNameObj.link || "#",
              type: rowData["type"] || "N/A",
              ipo_gmp: rowData["ipo gmp"].replaceAll("₹-", "-") || "N/A",
              price: rowData["price"] || "N/A",
              gain: rowData["gain"].replaceAll("-%", "-") || "N/A",
              date: rowData["date"] || "N/A",
              slug: generateSlugFromUrl(companyNameObj.link || "#"),
            };
            Gmp.push(formattedTable);
          } else if (typeof companyNameObj === "string") {
            const formattedTable = {
              company_name: rowData["upcoming ipo"] || "N/A",
              type: rowData["type"] || "N/A",
              ipo_gmp: rowData["ipo gmp"].replaceAll("₹-", "-") || "N/A",
              price: rowData["price"].replaceAll("₹-", "-") || "N/A",
              gain: rowData["gain"].replaceAll("-%", "-") || "N/A",
              date: rowData["date"].toLowerCase().replaceAll("soon", "Coming Soon") || "N/A",
            };
            Gmp.push(formattedTable);
          } else {
            console.error("MainIPO Name is missing or incorrect", rowData);
          }
        });

      // Locate the specific h2 element
      const heading = $(
        "h2.wp-block-heading#h-ipo-grey-market-premium-archive-2024-2023"
      );

      // Find the table immediately after the heading
      const additionalTable = heading
        .next("figure.wp-block-table")
        .find("table");
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
              const header = additionalHeaders[index];
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

          // Format data for the additional list
          const companyNameObj = rowData["ipo name"];
          if (companyNameObj && typeof companyNameObj === "object") {
            const formattedTable = {
              company_name: companyNameObj.text || "N/A",
              link: companyNameObj.link || "#",
              ipo_gmp: rowData["ipo price"] || "N/A",
              price: rowData["ipo gmp"] || "N/A",
              listed: rowData["listing price"] || "N/A",
              // date: rowData["date"] || "N/A",
              // type: rowData["type"] || "N/A",
              slug: generateSlugFromUrl(companyNameObj.link || "#"),
            };
            oldGmp.push(formattedTable);
          } else {
            console.error("Old IPO Name is missing or incorrect", rowData);
          }
        });

      const gmp = sortEntriesByDate(Gmp);

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

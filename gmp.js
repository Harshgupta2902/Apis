// gmp.js

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { generateSlugFromUrl } = require("./utils");

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
          headers.push($(column).text().trim());
        });

      table
        .find("tr")
        .slice(1)
        .each((index, row) => {
          const rowData = {};
          $(row)
            .find("td")
            .each((index, column) => {
              const anchor = $(column).find("a");
              if (anchor.length > 0) {
                const anchorText = anchor.text().trim();
                const anchorLink = anchor.attr("href").trim();
                rowData[headers[index]] = {
                  text: anchorText,
                  link: anchorLink,
                };
              } else {
                rowData[headers[index]] = $(column).text().trim();
              }
            });

          const formattedTable = {
            company_name: rowData["IPO Name"]["text"],
            link: rowData["IPO Name"]["link"],
            type: rowData["IPOType"],
            ipo_gmp: rowData["IPOGMP"],
            price: rowData["IPOPrice"],
            gain: rowData["ListingGain"],
            kostak: rowData["KostakRates"],
            subject: rowData["SubjectRates"],
            slug: generateSlugFromUrl(rowData["IPO Name"]["link"]),
          };
          gmp.push(formattedTable);
        });

      const additionalTable = $("figure.wp-block-table").eq(1).find("table");
      const additionalHeaders = [];
      additionalTable
        .find("tr")
        .first()
        .find("td")
        .each((index, column) => {
          additionalHeaders.push($(column).text().trim());
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
              const anchor = $(column).find("a");
              if (anchor.length > 0) {
                const anchorText = anchor.text().trim();
                const anchorLink = anchor.attr("href").trim();
                rowData[additionalHeaders[index]] = {
                  text: anchorText,
                  link: anchorLink,
                };
              } else {
                rowData[additionalHeaders[index]] = $(column).text().trim();
              }
            });

          // Format data for additional list
          const formattedTable = {
            company_name: rowData["IPO Name"]["text"],
            price: rowData["Price"],
            ipo_gmp: rowData["IPO GMP"],
            listed: rowData["Listed"],
            link: rowData["IPO Name"]["link"],
            slug: generateSlugFromUrl(rowData["IPO Name"]["link"]),
          };
          oldGmp.push(formattedTable);
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

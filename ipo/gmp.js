// gmp.js

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { generateSlugFromUrl } = require("../utils");

const router = express.Router();

const monthToNumber = (month) => {
  const months = {
    'Jan.': 1,
    'Feb.': 2,
    'Mar.': 3,
    'Apr.': 4,
    'May.': 5,
    'Jun.': 6,
    'Jul.': 7,
    'Aug.': 8,
    'Sept.': 9,
    'Oct.': 10,
    'Nov.': 11,
    'Dec.': 12,
  };
  return months[month] || 0; // Return 0 for unknown months
};

const sortEntriesByDate = (entries) => {
  return entries.sort((a, b) => {
    const [dayA, monthA] = a.date.split('-')[0].trim().split(' ');
    const [dayB, monthB] = b.date.split('-')[0].trim().split(' ');

    const monthNumA = monthToNumber(monthA);
    const monthNumB = monthToNumber(monthB);

    if (monthNumA !== monthNumB) {
      return monthNumB - monthNumA; // Sort by month descending
    } else {
      return parseInt(dayB) - parseInt(dayA); // Sort by day descending
    }
  });
};


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
              console.log(formattedTable);
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
              ipo_gmp: rowData["gmp rate"] || "N/A",
              price: rowData["price"] || "N/A",
              listed: rowData["listed"] || "N/A",
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

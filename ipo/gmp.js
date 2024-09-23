// gmp.js

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { generateSlugFromUrl } = require("../utils");

const router = express.Router();

function parseDateRange(dateRangeStr) {
  const [startDateStr, endDateStr] = dateRangeStr.split("-");
  const startDate = parseDate(startDateStr.trim());
  const endDate = parseDate(endDateStr.trim());
  return { startDate, endDate };
}

// Helper function to parse individual date strings like "19 Sept"
function parseDate(dateStr) {
  const [day, month] = dateStr.split(" ");
  const monthMap = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sept: 8, Oct: 9, Nov: 10, Dec: 11
  };
  if (!monthMap[month]) return null;
  const year = new Date().getFullYear(); // Assume this year's IPOs
  return new Date(year, monthMap[month], parseInt(day, 10));
}

// Sort data based on how close the date range is to today
function sortIpoDataByDateProximity(data) {
  const today = new Date();
  
  return data.sort((a, b) => {
    const { startDate: startA, endDate: endA } = parseDateRange(a.date);
    const { startDate: startB, endDate: endB } = parseDateRange(b.date);

    // Check if today's date is within either range
    const aIncludesToday = today >= startA && today <= endA;
    const bIncludesToday = today >= startB && today <= endB;

    if (aIncludesToday && !bIncludesToday) return -1;
    if (!aIncludesToday && bIncludesToday) return 1;

    // Otherwise, sort by which date range is closer to today
    const aProximity = Math.abs(today - startA);
    const bProximity = Math.abs(today - startB);

    return aProximity - bProximity;
  });
}


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
                ipo_gmp: rowData["ipo gmp"] || "N/A",
                price: rowData["price"] || "N/A",
                gain: rowData["gain"] || "N/A",
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

        const gmp = sortIpoDataByDateProximity(Gmp);


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

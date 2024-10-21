// gmp.js

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const {
  generateSlugFromUrl,
  sortEntriesByDate,
  monthToNumber,
} = require("../utils");

const router = express.Router();
const addActiveFlag = (ipoList) => {
  const currentDate = new Date();

  console.log("Current Date:", currentDate);

  const updatedIpoList = ipoList.map((ipo) => {
    let isActive = false;

    if (ipo.date === "Coming Soon") {
      isActive = false;
      console.log();
    } else {
      const [dayRange, month] = ipo.date.split(" ");

      if (dayRange.includes("-")) {
        const [startDay, endDay] = dayRange.split("-");
        const monthNumber = monthToNumber(month);

        const startDate = new Date(2024, monthNumber - 1, parseInt(startDay));
        const endDate = new Date(2024, monthNumber - 1, parseInt(endDay));

        console.log();

        if (currentDate >= startDate && currentDate <= endDate) {
          isActive = true;
        } else if (currentDate < startDate) {
          isActive = true;
        } else {
          isActive = false;
        }
      } else {
        const singleDate = new Date(
          2024,
          monthToNumber(month) - 1,
          parseInt(dayRange)
        );

        if (
          currentDate.getTime() === singleDate.getTime() ||
          currentDate < singleDate
        ) {
          isActive = true;
        } else {
          isActive = false;
        }
      }
    }

    return {
      ...ipo,
      active: isActive,
    };
  });

  const filteredIpoList = updatedIpoList.filter((ipo) => {
    const [startDate, endDate] = ipo.date.split(" ")[0].split("-").map(Number);
    const month = monthToNumber(ipo.date.split(" ")[1]);

    const ipoDate = new Date(currentDate.getFullYear(), month - 1, endDate);
    // console.log(`month: ${month}   ${ipo.date.split(" ")[1]}   endate:: ${endDate}   ipodate: ${ipoDate}   year: ${currentDate.getFullYear()}`);

    return !(ipoDate < currentDate);
  });

  return filteredIpoList;
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
          const companyNameObj = rowData["current ipos"];
          if (companyNameObj && typeof companyNameObj === "object") {
            const formattedTable = {
              company_name: companyNameObj.text || "N/A",
              link: companyNameObj.link || "#",
              type: rowData["type"] || "N/A",
              ipo_gmp: rowData["ipo gmp"] || "N/A",
              price: rowData["price band"] || "N/A",
              gain: rowData["listinggain"] || "N/A",
              date: rowData["ipo date"] || "N/A",
              slug: generateSlugFromUrl(companyNameObj.link || "#"),
            };
            Gmp.push(formattedTable);
          } else if (typeof companyNameObj === "string") {
            const formattedTable = {
              company_name: rowData["upcoming ipo"] || "N/A",
              type: rowData["type"] || "N/A",
              ipo_gmp: rowData["ipo gmp"].replaceAll("₹-", "-") || "N/A",
              price: rowData["price band"] || "N/A",
              gain: rowData["listinggain"] || "N/A",
              date:
                rowData["ipo date"]
                  .toLowerCase()
                  .replaceAll("soon", "Coming Soon") || "N/A",
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

      const sortedGmp = sortEntriesByDate(Gmp);

      const finalgmp = sortedGmp.sort((a, b) => {
        const gmpA = a.gain.includes("%")
          ? parseInt(a.gain.replace("%", ""))
          : 0;
        const gmpB = b.gain.includes("%")
          ? parseInt(b.gain.replace("%", ""))
          : 0;

        return gmpB - gmpA;
      });

      const gmp = addActiveFlag(finalgmp);

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

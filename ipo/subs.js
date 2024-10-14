// scrapeDataAPI.js

const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

router.get("/", async (req, res) => {
  try {
    const url1 =
      "https://www.chittorgarh.com/report/ipo-subscription-status-live-bidding-data-bse-nse/21/?year=2024";
    const url2 =
      "https://www.chittorgarh.com/report/sme-ipo-subscription-status-live-bidding-bse-nse/22/";

    const response1 = await axios.get(url1);
    const data1 = await extractData(response1.data);

    const response2 = await axios.get(url2);
    const data2 = await extractData(response2.data);

    const combinedData = {
      ipo_subscription_data: data1,
      sme_subscription_data: data2,
    };

    res.json(combinedData);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Function to extract data from HTML
async function extractData(html) {
  const $ = cheerio.load(html);
  const tableData = $("#report_data table")
    .map(function () {
      const headers = [];
      const rows = [];
      $(this)
        .find("thead th")
        .each(function () {
          headers.push($(this).text().trim());
        });
      $(this)
        .find("tbody tr")
        .each(function () {
          const row = {};
          $(this)
            .find("td")
            .each(function (index) {
              row[mapHeader(headers[index])] = $(this).text().trim();
            });
          rows.push(row);
        });
      return rows;
    })
    .get();
  return tableData;
}

function mapHeader(header) {
  const headerMap = {
    "Company Name": "company_name",
    "Open Date": "open",
    "Close Date": "close",
    "Size (Rs Cr)": "size_rs_cr",
    "QIB (x)": "qib_x",
    "sNII (x)": "nii_x",
    "bNII (x)": "bnii_x",
    "NII (x)": "nii_x",
    "Retail (x)": "retail_x",
    "Employee (x)": "employee_x",
    "Others (x)": "others_x",
    "Total (x)": "total_x",
    Applications: "applications",
  };
  return headerMap[header] || header;
}

module.exports = router;

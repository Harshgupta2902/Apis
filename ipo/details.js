const express = require("express");
const bodyParser = require("body-parser");
const url = require("url");
const axios = require("axios");
const cheerio = require("cheerio");
const sanitizeHtml = require("sanitize-html");

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

function findHeading($, element) {
  let heading = $(element).prev("h2").text();
  if (!heading) {
    let prevElement = $(element).prev();
    while (prevElement.length > 0) {
      if (prevElement.is("h2")) {
        heading = prevElement.text();
        break;
      }
      prevElement = prevElement.prev();
    }
  }
  return heading;
}
async function PriceBandtable(link) {
  try {
    const response = await axios.get(link);
    const html = response.data;
    const $ = cheerio.load(html);

    const tables = $("table");
    const jsonData = [];

    tables.each((index, table) => {
      const heading = findHeading($, table); // Get the nearest preceding h2 tag text content
      const tableName = heading ? heading : "";

      const cleanedHtml = cleanHtml($(table).html());

      const tableObject = {
        name: tableName,
        data: `${cleanedHtml}`,
      };
      jsonData.push(tableObject);
    });

    return jsonData;
  } catch (error) {
    return { error: `Error fetching the page: ${error.message}` };
  }
}
function cleanHtml(html) {
  // Remove unwanted HTML tags and attributes
  const sanitizedHtml = sanitizeHtml(html, {
    allowedTags: ["table", "thead", "tbody", "tr", "th", "td"],
    allowedAttributes: {
      table: [],
      thead: [],
      tbody: [],
      tr: [],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
  });

  // Remove inline styles
  const cleanedHtml = sanitizedHtml.replace(/ style=".*?"/g, "");

  return cleanedHtml;
}
async function fetchAllUlAfterHeadings(link) {
  try {
    const response = await axios.get(link);
    const html = response.data;
    const $ = cheerio.load(html);
    const headingElements = $("h2, h3");
    const results = [];

    headingElements.each((index, headingElement) => {
      const headingText = $(headingElement).text().trim();
      const ulElement = $(headingElement).next("ul");

      if (ulElement.length) {
        const ulObject = {
          heading: headingText,
          items: [],
        };

        ulElement.find("li").each((itemIndex, li) => {
          ulObject.items.push($(li).text().trim());
        });

        results.push(ulObject);
      }
    });

    return results;
  } catch (error) {
    return { error: `Error fetching the page: ${error.message}` };
  }
}

router.get("/", async (req, res) => {
  try {
    const { link } = req.query;

    if (!link) {
      return res.status(400).json({
        error: "Please provide link",
      });
    }

    if (link.includes("undefined")) {
      return res.status(400).json({
        error: "link is undefined",
      });
    }

    const newlink = `https://ipowatch.in/${link}`;

    const priceBandResult = await PriceBandtable(newlink);
    const ulAfterHeadingsResult = await fetchAllUlAfterHeadings(newlink);
    const parsedUrl = url.parse(newlink);
    const pathParts = parsedUrl.pathname.split("/");
    const slug = pathParts[pathParts.length - 2];

    if (ulAfterHeadingsResult.length > 0 && priceBandResult.length > 0) {
      const organizedData = {
        ulAfterHeadingsResult: ulAfterHeadingsResult,
        tables: priceBandResult,
        slug: slug,
        link: newlink,
      };

      return res.json(organizedData);
    }

    return res.status(500).json({
      error: `No Data Found: ${error.message}`,
    });
  } catch (error) {
    console.error(
      `An error occurred while fetching data for IPO: ${error.message}`
    );
    return res.status(500).json({
      error: `An error occurred while fetching data for IPO: ${error.message}`,
    });
  }
});

module.exports = router;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { generateSlugFromUrl } = require("../utils");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const url = "https://ipowatch.in/upcoming-ipo-calendar-ipo-list/";
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const ipos = $("table tbody tr")
      .slice(1)
      .map((index, row) => {
        const columns = $(row).find("td");
        const company_name = columns.eq(0).text().trim();
        const link = columns.eq(0).find("a").attr("href");
        const date = columns.eq(1).text().trim(); // Capture date range
        const type = columns.eq(2).text().trim();
        const size = columns.eq(3).text().trim();
        const priceband = columns.eq(4).text().trim();
        const fullLink =
          link && !link.startsWith("http")
            ? `https://ipowatch.in/${link}`
            : link;

        let slug = generateSlugFromUrl(`${fullLink}`);
        slug = slug === undefined ? null : slug;

        return {
          company_name,
          date,
          type,
          size,
          priceband,
          link: `${fullLink}`,
          slug,
        };
      })
      .get();

    const data = sortEntriesByDate(ipos);
    const upcomingIpos = data.filter(
      (ipo) =>
        ipo.link !== "undefined" &&
        ipo.slug !== "undefined" &&
        ipo.company_name !== "Company Name"
    );

    res.json({ upcomingIpos });
  } catch (error) {
    console.error("Error fetching IPO data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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

module.exports = router;

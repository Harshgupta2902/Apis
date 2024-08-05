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

    const upcomingIpos = $("table tbody tr")
      .slice(1)
      .map((index, row) => {
        const columns = $(row).find("td");
        const company_name = columns.eq(0).text().trim();
        const link = columns.eq(0).find("a").attr("href");
        const date = columns.eq(1).text().trim();
        const size = columns.eq(2).text().trim();
        const price = columns.eq(3).text().trim();
        const status = "Upcoming";
        const fullLink =
          link && !link.startsWith("http")
            ? `https://ipowatch.in/${link}`
            : link;

        let slug = generateSlugFromUrl(`${fullLink}`); // Ensure to handle empty link gracefully
        slug = slug === undefined ? null : slug;

        return {
          company_name,
          date,
          size,
          price,
          status,
          link: `${fullLink}`,
          slug,
        };
      })
      .get();

    res.json({ test });
  } catch (error) {
    console.error("Error fetching IPO data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

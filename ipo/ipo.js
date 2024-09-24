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

    const parseDate = (dateStr) => {
      const [dayMonth, monthYear] = dateStr.split("-");
      const [day, month] = dayMonth.split(" ").map((part) => part.trim());
      const monthIndex = {
        Jan: 0,
        Feb: 1,
        Mar: 2,
        Apr: 3,
        May: 4,
        Jun: 5,
        Jul: 6,
        Aug: 7,
        Sept: 8,
        Oct: 9,
        Nov: 10,
        Dec: 11,
      };

      // Handle single month entries or multi-day entries
      if (monthYear) {
        const [monthStart, yearStart] = monthYear.split(" ");
        const startDate = new Date();
        startDate.setDate(parseInt(day));
        startDate.setMonth(monthIndex[monthStart]);
        startDate.setFullYear(new Date().getFullYear()); // assuming this year

        return startDate;
      }
      return null; // or handle other formats
    };

    ipos.sort((a, b) => {
      // Convert the date to a comparable format
      const dateA = parseDate(a.date) || new Date(9999, 12, 31); // Default future date
      const dateB = parseDate(b.date) || new Date(9999, 12, 31);
      return dateB - dateA;
    });

    const upcomingIpos = ipos.filter(
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

module.exports = router;

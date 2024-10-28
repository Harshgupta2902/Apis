const express = require("express");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const cron = require("node-cron");

const app = express();
const PORT = 3000;

const checkForNewPosts = async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.moneycontrol.com/news/business/ipo/page-1/");

    const html = await page.content();
    const $ = cheerio.load(html);

    let latestArticle = null;

    $("#cagetory li")
      .not(".hide-mobile, .show-mobile")
      .each((i, elem) => {
        const title = $(elem).find("h2 a").text();
        const link = $(elem).find("a").attr("href");
        let image = $(elem).find("img").attr("data");

        if (image) {
          image = image.split("?")[0];
        }

        // Extract the commented span text for the date
        const comment = $(elem)
          .html()
          .match(/<!--\s*<span>(.*?)<\/span>\s*-->/);
        const rawDate = comment ? comment[1].trim() : null;

        let formattedDate = null;
        if (rawDate) {
          const dateParts = rawDate.match(
            /(\w+) (\d+), (\d{4}) (\d{2}):(\d{2}) ([APM]+) IST/
          );

          if (dateParts) {
            const [, month, day, year, hours, minutes, ampm] = dateParts;
            const shortYear = year.slice(2);
            const shortMonth = new Date(`${month} 1`).toLocaleString("en-us", {
              month: "short",
            });
            formattedDate = `${day} ${shortMonth},${shortYear} ${hours}:${minutes} ${ampm}`;
          }
        }

        if (title) {
          latestArticle = { title, link, image, date: formattedDate };
          return false;
        }
      });
    if (latestArticle) {
      const currentTime = logCurrentTime();
      console.log(`[${currentTime}] New post published:`, latestArticle);
    } else {
      const currentTime = logCurrentTime();
      console.log(`[${currentTime}] No new post found.`);
    }
    await browser.close();
  } catch (error) {
    console.error("Error checking for new posts:", error.message);
  }
};

// Schedule the task to run every 5 minutes
cron.schedule("*/5 * * * *", () => {
  const currentTime = logCurrentTime();

  console.log(`[${currentTime}] Checking for new posts...`);
  checkForNewPosts();
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const logCurrentTime = () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString("en-us", { month: "short" });
  const year = now.getFullYear().toString().slice(2); // Get the last two digits of the year
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
  return (formattedTime = `${day} ${month}, ${year} ${hours}:${minutes} ${ampm}`);
};

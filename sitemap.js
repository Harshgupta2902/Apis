const axios = require("axios");
const fs = require("fs");
const path = require("path");
const xmlbuilder = require("xmlbuilder");

// Function to fetch URLs from the API
async function fetchUrls(apiUrl) {
  try {
    const response = await axios.get(apiUrl);
    // Log the response to understand its structure
    console.log("API Response:", response.data);
    return response.data.links || []; // Adjust this based on the actual structure
  } catch (error) {
    console.error("Error fetching URLs:", error.message);
    return [];
  }
}

// Function to split URLs into chunks
function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

// Function to create XML sitemap
function createSitemapFile(filePath, urls) {
  const urlset = xmlbuilder
    .create("urlset", { version: "1.0", encoding: "UTF-8" })
    .att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9");

  urls.forEach((url) => {
    const formattedUrl = `https://www.ipotec.in/ifsc-code/${url.replaceAll(
      "&",
      ""
    )}`;

    urlset
      .ele("url")
      .ele("loc", formattedUrl)
      .up()
      .ele("lastmod", new Date().toISOString()) // Current timestamp
      .up()
      .ele("priority", "1.0"); // Fixed priority
  });

  const xml = urlset.end({ pretty: true });
  fs.writeFileSync(filePath, xml);
}

// Main function to generate sitemaps
async function generateSitemaps() {
  const apiUrl =
    "https://apis-iota-five.vercel.app/api/getIfsc/ICIC0000184?all=all";
  const urls = await fetchUrls(apiUrl);

  if (urls.length === 0) {
    console.error("No URLs found.");
    return;
  }

  console.log(`Total URLs retrieved: ${urls.length}`);

  const chunkSize = 10000;
  const urlChunks = chunkArray(urls, chunkSize);
  const outputDir = path.join(__dirname, "sitemaps");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  urlChunks.forEach((chunk, index) => {
    const filePath = path.join(outputDir, `ifsc-details${index + 1}.xml`);
    createSitemapFile(filePath, chunk);
    console.log(`Created ${filePath}`);
  });
}

// Run the script
generateSitemaps();

const url = require("url");

function generateSlugFromUrl(urlString) {
  const parsedUrl = url.parse(urlString);
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, ""); // Remove leading and trailing slashes
  const parts = path.split("/");
  const lastPart = parts[parts.length - 1];
  return lastPart;
}

const monthToNumber = (month) => {
  const months = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sept: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12
  };
  return months[month] || 0;
};

const sortEntriesByDate = (entries) => {
  return entries.sort((a, b) => {
    if (a.date === "Coming Soon" && b.date === "Coming Soon") {
      return 0; 
    } else if (a.date === "Coming Soon") {
      return 1; 
    } else if (b.date === "Coming Soon") {
      return -1;
    }

    // If neither is "Coming Soon", we need to sort by the date
    const dateA = monthToNumber(a.date);
    const dateB = monthToNumber(b.date);

    // Sort by date (descending)
    return dateB - dateA;
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-"; // Return '-' if date is missing
  const parts = dateStr.split(" ");
  if (parts.length >= 2) {
    const day = parts[1].replace(",", ""); // Remove comma
    const month = parts[0]; // Month is the first part
    return `${day} ${month}`; // Return formatted date
  }
  return dateStr; // Return original string if it doesn't match expected format
};

module.exports = {
  generateSlugFromUrl,
  sortEntriesByDate,
  formatDate,
  monthToNumber,
};

const url = require('url');

function generateSlugFromUrl(urlString) {
  const parsedUrl = url.parse(urlString);
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, ''); // Remove leading and trailing slashes
  const parts = path.split('/');
  const lastPart = parts[parts.length - 1];
  return lastPart;
}



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



module.exports = {
  generateSlugFromUrl,
  sortEntriesByDate
};

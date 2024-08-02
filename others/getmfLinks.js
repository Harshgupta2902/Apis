const axios = require('axios');
const fs = require('fs');

const baseUrl = 'https://groww.in/v1/api/search/v1/derived/scheme';
const totalPages = 106; // Adjust based on the number of pages you want to fetch
const resultsPerPage = 15; // Adjust as per the API's results per page

async function fetchPage(page) {
  try {
    const response = await axios.get(baseUrl, {
      params: {
        available_for_investment: true,
        doc_type: 'scheme',
        page: page,
        plan_type: 'Direct',
        size: resultsPerPage,
        sort_by: 3
      }
    });
    return response.data.content.map(item => item.search_id);
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error.message);
    return [];
  }
}

async function fetchAllSearchIds() {
  let allSearchIds = [];
  for (let page = 0; page <= totalPages; page++) {
    console.log(`Fetching page ${page}...`);
    const searchIds = await fetchPage(page);
    allSearchIds = allSearchIds.concat(searchIds);
    console.log(`Fetched ${searchIds.length} search_ids from page ${page}`);
  }
  return allSearchIds;
}

(async () => {
  try {
    const allSearchIds = await fetchAllSearchIds();
    fs.writeFileSync('search_ids.json', JSON.stringify(allSearchIds, null, 2));
    console.log('Search IDs have been saved to search_ids.json');
  } catch (error) {
    console.error('Error fetching search IDs:', error.message);
  }
})();

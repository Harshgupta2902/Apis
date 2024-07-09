// scrapeSMEIPOData.js

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { generateSlugFromUrl } = require('./utils');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://ipowatch.in/upcoming-sme-ipo-calendar-list/');
    const html = response.data;

    const $ = cheerio.load(html);

    const smeData = [];
    $('table tbody tr').each((index, element) => {
      const rowData = {};
      $(element).find('td').each((i, td) => {
        const anchor = $(td).find('a');
        if (anchor.length > 0) {
          const anchorText = anchor.text().trim();
          const anchorLink = anchor.attr('href').trim();
          rowData['link'] = anchorLink;
          rowData[`Column_${i + 1}`] = anchorText;
        } else {
          rowData[`Column_${i + 1}`] = $(td).text().trim();
        }
      });
      const formattedTable = {
        company_name: rowData["Column_1"],
        date: rowData["Column_2"],
        price: rowData["Column_3"],
        Platform: rowData["Column_4"],
        link: rowData["link"],
        slug: generateSlugFromUrl(`${rowData['link']}`),
      };
      smeData.push(formattedTable);
    });

    res.json({smeData});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/", async (req, res) => {
  const { pincode } = req.query;

  if (!pincode) return res.status(400).json({ error: "Pincode is required" });

  // Read the JSON file
  fs.readFile("pincode_data.json", "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading file" });

    const pinData = JSON.parse(data);
    const results = pinData
      .filter((entry) => entry.PinCode == pincode)
      .map((entry) => ({
        PostOffice: entry.PostOffice,
        State: entry.State,
        District: entry.District,
        PinCode: entry.PinCode,
      }));

    res.json(results.length ? results : { message: "No results found" });
  });
});

module.exports = router;

// const mysql = require('mysql2');
// const fs = require('fs');

// // Create a MySQL connection
// const connection = mysql.createConnection({
//   host: 'localhost',  // Replace with your MySQL host
//   user: 'root',       // Replace with your MySQL username
//   password: '',  // Replace with your MySQL password
//   database: 'banks' // Replace with your database name
// });

// // Function to fetch data and save to JSON
// function fetchPincodeAndSaveToJson() {
//   // SQL query to select all from the 'pincode' table
//   const query = 'SELECT * FROM pincode_details1';

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error('Error executing query:', error);
//       return;
//     }

//     // Convert results to JSON
//     const filteredResults = results.map((entry) => {
//       const { id, Country, ...rest } = entry;  // Destructure and exclude 'id' and 'Country'
//       return rest;
//     });

//     // Convert filtered results to JSON
//     const jsonData = JSON.stringify(filteredResults, null, 2);

//     // Write JSON data to a file
//     fs.writeFile('pincode_data.json', jsonData, (err) => {
//       if (err) {
//         console.error('Error writing to file:', err);
//       } else {
//         console.log('Data saved to pincode_data.json');
//       }
//     });
//   });
// }

// // Call the function
// fetchPincodeAndSaveToJson();

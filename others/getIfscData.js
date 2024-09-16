const mysql = require("mysql2");
const fs = require("fs");

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost", // Replace with your MySQL host
  user: "root", // Replace with your MySQL username
  password: "", // Replace with your MySQL password
  database: "banks", // Replace with your database name
});

// Function to fetch data and save to JSON
function fetchPincodeAndSaveToJson() {
  // SQL query to select all from the 'pincode' table
  const query = "SELECT Branch, State, Ifsc, City2, Bank FROM banks";

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return;
    }

    // Convert results to JSON
    const filteredResults = results.map((entry) => {
      const { id, Country, ...rest } = entry; // Destructure and exclude 'id' and 'Country'
      return rest;
    });

    // Convert filtered results to JSON
    const jsonData = JSON.stringify(filteredResults, null, 2);

    // Write JSON data to a file
    fs.writeFile("ifsc.json", jsonData, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log("Data saved to ifsc.json");
      }
    });
  });
}

// Call the function
fetchPincodeAndSaveToJson();

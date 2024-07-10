// app.js

const express = require("express");
const ipoService = require("./ipo/ipo");
const buybackService = require("./ipo/buyback");
const formsService = require("./ipo/forms");
const gmpService = require("./ipo/gmp");
const mainService = require("./ipo/main");
const smeService = require("./ipo/sme");
const subsService = require("./ipo/subs");
const details = require("./ipo/details");

const app = express();

app.get("/", (req, res) => {
  res.send("API is running");
});

// Define API endpoints
app.use("/api/ipo", ipoService);
app.use("/api/main", mainService);
app.use("/api/sme", smeService);
app.use("/api/gmp", gmpService);
app.use("/api/buyback", buybackService);
app.use("/api/forms", formsService);
app.use("/api/subs", subsService);
app.use("/api/getDetails", details);

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});

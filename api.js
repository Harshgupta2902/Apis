// app.js

const express = require("express");
const ipoService = require("./ipo");
const buybackService = require("./buyback");
const formsService = require("./forms");
const gmpService = require("./gmp");
const mainService = require("./main");
const smeService = require("./sme");
const subsService = require("./subs");
const details = require("./details");

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

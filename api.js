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

const getNav = require("./mf/getNav");
const insertMfScreener = require("./mf/insertScreener");
const getisin = require("./mf/getisin");
const insertNav = require("./mf/insertNav");

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

app.use("/api/getNav", getNav);
app.use("/api/insertMfScreener", insertMfScreener);
app.use("/api/getisin", getisin);
app.use("/api/insertNav", insertNav);

app.listen(3200, () => {
  console.log(`Server is running on port ${3200}`);
});

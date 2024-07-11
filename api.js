const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

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

const getIndices = require("./others/getIndices");
const getTrend = require("./others/getTrend");

app.get("/", (req, res) => {
  res.send("API is running");
});

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

app.use("/api/getIndices", getIndices);
app.use("/api/getTrend", getTrend);

app.listen(3001, () => {
  console.log(`Server is running on port ${3001}`);
});

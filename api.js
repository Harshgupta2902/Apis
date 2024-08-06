const cors = require("cors");
const express = require("express");
const NodeCache = require("node-cache");
const cron = require("node-cron");

const cache = new NodeCache({ stdTTL: 3600 });

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(cachedResponse);
  }

  console.log(`Cache miss for ${key}`);
  res.originalSend = res.send;
  res.send = (body) => {
    cache.set(key, body);
    console.log(`Cache set for ${key}`);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.originalSend(body);
  };
  next();
};

const app = express();
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=3600");
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
const getAdditionalIpo = require("./ipo/getAdditionalIpo");
const getIpoLinks = require("./ipo/getIpoLinks");

const getMfScreener = require("./mf/getMfScreener");
const getMfDetails = require("./mf/getMfDetails");
const getNav = require("./mf/getNav");
const getMfLinks = require("./mf/getmfLinks");
const amc = require("./mf/amc");

const insertBlog = require("./blogs/insertBlog");
const getBlogDetails = require("./blogs/getBlogDetails");
const getblogs = require("./blogs/getblogs");

const getMetaData = require("./meta-data");


app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/ipo", cacheMiddleware, ipoService);
app.use("/api/main", cacheMiddleware, mainService);
app.use("/api/sme", cacheMiddleware, smeService);
app.use("/api/gmp", cacheMiddleware, gmpService);
app.use("/api/buyback", cacheMiddleware, buybackService);
app.use("/api/forms", cacheMiddleware, formsService);
app.use("/api/subs", cacheMiddleware, subsService);
app.use("/api/getDetails", cacheMiddleware, details);
app.use("/api/getAdditionalIpo", cacheMiddleware, getAdditionalIpo);
app.use("/api/getIpoLinks", cacheMiddleware, getIpoLinks);

app.use("/api/getMfDetails", cacheMiddleware, getMfDetails);
app.use("/api/getMfScreener", cacheMiddleware, getMfScreener);
app.use("/api/getNav", cacheMiddleware, getNav);
app.use("/api/getMfLinks", cacheMiddleware, getMfLinks);
app.use("/api/amc", cacheMiddleware, amc);

app.use("/api/insertBlog", insertBlog);
app.use("/api/getBlogDetails", cacheMiddleware, getBlogDetails);
app.use("/api/getblogs", cacheMiddleware, getblogs);

app.use("/api/meta-data", getMetaData);


app.get("/api/clearCache", (req, res) => {
  console.log("Cache cleared successfully");
  cache.flushAll();
  res.send("Cache cleared successfully");
});

const cacheKeysToClear = [
  "/api/ipo",
  "/api/main",
  "/api/sme",
  "/api/gmp",
  "/api/buyback",
  "/api/forms",
  "/api/subs",
  "/api/getAdditionalIpo",
];

cron.schedule("0 */6 * * *", () => {
  console.log("Clearing specific cache keys every 6 hours");
  cacheKeysToClear.forEach((key) => {
    cache.del(key);
    console.log(`Cache cleared for ${key}`);
  });
});

app.listen(4001, () => {
  console.log(`Server is running on http://localhost:${4001}/api`);
});

// cron.schedule("0 6 * * *", () => {
//   console.log("Clearing cache at mornign 6");
//   cache.flushAll();
// });

// app.use("/api/insertMfScreener", cacheMiddleware, insertMfScreener);
// app.use("/api/getisin", cacheMiddleware, getisin);
// app.use("/api/insertNav", cacheMiddleware, insertNav);
// app.use("/api/checkPan", cacheMiddleware, checkPan);

// const insertMfScreener = require("./mf/insertScreener");
// const getisin = require("./mf/getisin");
// const insertNav = require("./mf/insertNav");
// const getMfScreener = require("./mf/getMfScreener");
// const checkPan = require("./others/checkPan");

// const getIndices = require("./others/getIndices");
// const getTrend = require("./others/getTrend");

// app.use("/api/getIndices", cacheMiddleware, getIndices);
// app.use("/api/getTrend", cacheMiddleware, getTrend);

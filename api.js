const cors = require("cors");
const express = require("express");
const NodeCache = require("node-cache");
const cron = require("node-cron");

const cache = new NodeCache({ stdTTL: 3600 }); // cache for 1 hour

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`Cache hit for ${key}`);
    return res.send(cachedResponse);
  }

  console.log(`Cache miss for ${key}`);
  res.originalSend = res.send;
  res.send = (body) => {
    cache.set(key, body);
    console.log(`Cache set for ${key}`);
    res.originalSend(body);
  };
  next();
};

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
const getAdditionalIpo = require("./ipo/getAdditionalIpo");

const getNav = require("./mf/getNav");
const insertMfScreener = require("./mf/insertScreener");
const getisin = require("./mf/getisin");
const insertNav = require("./mf/insertNav");

const getMfScreener = require("./mf/getMfScreener");
const getMfHomePage = require("./mf/getMfHomePage");

const getIndices = require("./others/getIndices");
const getTrend = require("./others/getTrend");

const insertBlog = require("./blogs/insertBlog");
const getBlogDetails = require("./blogs/getBlogDetails");
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

app.use("/api/getNav", cacheMiddleware, getNav);
app.use("/api/insertMfScreener", cacheMiddleware, insertMfScreener);
app.use("/api/getisin", cacheMiddleware, getisin);
app.use("/api/insertNav", cacheMiddleware, insertNav);

app.use("/api/getMfHomePage", cacheMiddleware, getMfHomePage);
app.use("/api/getMfScreener", cacheMiddleware, getMfScreener);

app.use("/api/getIndices", cacheMiddleware, getIndices);
app.use("/api/getTrend", cacheMiddleware, getTrend);

app.use("/api/insertBlog", insertBlog);
app.use("/api/getBlogDetails", cacheMiddleware, getBlogDetails);
app.use("/api/meta-data", getMetaData);

app.get("/api/clearCache", (req, res) => {
  console.log("Cache cleared successfully");
  cache.flushAll();
  res.send("Cache cleared successfully");
});

cron.schedule("0 */2 * * *", () => {
  console.log("Clearing cache at every 2 hour");
  cache.flushAll();
});

app.listen(3002, () => {
  console.log(`Server is running on http://localhost:${3002}/api`);
});

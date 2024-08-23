const { db } = require("../firebase");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("blogs").get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "No blogs found" });
    }
    const blogs = snapshot.docs.map((doc) => {
      const data = doc.data();
      const { slug, published_at } = data;

      const published = new Date(
        published_at._seconds * 1000
      ).toISOString();

      return { slug, published };
    });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

module.exports = router;

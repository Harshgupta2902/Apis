const { db } = require("../firebase");
const express = require("express");
const router = express.Router();

// Route to get NAV data
router.get("/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    // Retrieve blog post data from Firestore
    const doc = await db.collection("blogs").doc(slug).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const blogData = doc.data();

    res.status(200).json(blogData);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

module.exports = router;

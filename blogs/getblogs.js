const { db } = require("../firebase");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("blogs").get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "No blogs found" });
    }
    const blogs = snapshot.docs.map((doc) => ({...doc.data() }));
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

module.exports = router;

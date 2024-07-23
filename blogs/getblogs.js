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
    const latestblogs = blogs.length > 0 ? blogs[0] : null;
    const otherblogs = blogs.slice(1);

    // Construct the response object
    const response = {
      latestblogs,
      otherblogs
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

module.exports = router;

const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const { body, validationResult } = require("express-validator");
const { db, bucket } = require("../firebase");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 26624 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, JPEG, and PNG are allowed."));
    }
  },
});

// Route to create a blog post
router.post(
  "/",
  upload.single("image"),
  [
    body("post_name").notEmpty().withMessage("Post Name is required"),
    body("short_description")
      .notEmpty()
      .withMessage("Short Description is required"),
    body("description").notEmpty().withMessage("Post Body is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("alt_keyword").notEmpty().withMessage("Alt Keyword is required"),
    body("meta_description")
      .notEmpty()
      .withMessage("Meta Description is required"),
    body("robots").notEmpty().withMessage("Robots is required"),
    body("meta_title").notEmpty().withMessage("Meta Title is required"),
    body("meta_keywords").notEmpty().withMessage("Meta Keywords are required"),
    body("author").notEmpty().withMessage("Author is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const imageBuffer = req.file.buffer;
      const altKeyword = req.body.alt_keyword.replace(/\s+/g, "_");
      const filename = `${altKeyword.replace(" ", "")}${
        req.file.mimetype === "image/png" ? ".png" : ".jpg"
      }`;
      const tempPath = path.join(__dirname, filename);

      // Resize and compress the image
      await sharp(imageBuffer)
        .resize(800, 600, { fit: "inside" })
        .jpeg({ quality: 90 })
        .toFile(tempPath);

      // Upload the image to Firebase Storage
      await bucket.upload(tempPath, {
        destination: `${filename}`,
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

      fs.unlinkSync(tempPath);
      const publishedAt = new Date();

      const blogData = {
        title: req.body.post_name,
        description: req.body.short_description,
        blog: req.body.description,
        image: imageUrl,
        alt_keyword: req.body.alt_keyword,
        category: req.body.category,
        slug: createSlug(req.body.post_name),
        meta_description: req.body.meta_description,
        meta_title: req.body.meta_title,
        robots: req.body.robots,
        meta_keywords: req.body.meta_keywords,
        author: req.body.author,
        published_at: publishedAt,
      };

      await db.collection("blogs").doc(blogData.slug).set(blogData);

      res
        .status(200)
        .json({ message: "Blog post created successfully", blogData });
    } catch (error) {
      
      res.status(500).send(`Error: ${error.message}`);

    }
  }
);
``;
// Function to create slug
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

module.exports = router;

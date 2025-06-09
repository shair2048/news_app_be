const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { getNews, createNews } = require("../controllers/news.controller");

router.post("/", upload.single("imageUrl"), createNews);
router.get("/", getNews);

module.exports = router;

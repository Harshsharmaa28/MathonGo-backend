const express = require("express");
const multer = require("multer");
const {
  getChapters,
  getChapter,
  uploadChapters,
} = require("../controllers/chapterController");
const cache = require("../middlewares/cache");
const adminAuth = require("../middlewares/adminAuth");

const router = express.Router();
const upload = multer();

router.get("/chapters", cache, getChapters);
router.get("/chapters/:id", getChapter);
router.post("/chapters", adminAuth,uploadChapters);

module.exports = router;

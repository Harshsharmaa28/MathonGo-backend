const Chapter = require("../models/Chapter");
const redis = require("../config/redis");

exports.getChapters = async (req, res) => {
  const { class: cls, unit, status, subject, weakChapter, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (cls) filter.class = cls;
  if (unit) filter.unit = unit;
  if (status) filter.status = status;
  if (subject) filter.subject = subject;
  if (weakChapter !== undefined) filter.weakChapter = weakChapter === 'true';

  const skip = (page - 1) * limit;
  const [chapters, total] = await Promise.all([
    Chapter.find(filter).skip(skip).limit(+limit),
    Chapter.countDocuments(filter)
  ]);

  res.json({ total, results: chapters });
};

exports.getChapter = async (req, res) => {
  const chapter = await Chapter.findById(req.params.id);
  if (!chapter) return res.status(404).json({ message: "Chapter not found" });
  res.json(chapter);
};

exports.uploadChapters = async (req, res) => {
  try {
    // console.log("Received body:", req.body);

    const chapters = Array.isArray(req.body) ? req.body : [req.body];

    const results = await Promise.allSettled(
      chapters.map(async (data) => {
        console.log("Saving chapter:", data);
        return await new Chapter(data).save();
      })
    );

    const failed = results
      .map((r, i) => r.status === "rejected" ? chapters[i] : null)
      .filter(Boolean);

    // console.log("Failed inserts:", failed);

    await redis.flushall();

    res.status(200).json({ message: "Upload complete", failed });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(400).json({ message: "Invalid request", error: err.message });
  }
};
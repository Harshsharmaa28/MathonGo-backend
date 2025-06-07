const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  subject: String,
  chapter: String,
  class: String,
  unit: String,
  yearWiseQuestionCount: {
    type: Map,
    of: Number
  },
  questionSolved: Number,
  status: String,
  isWeakChapter: Boolean
});

module.exports = mongoose.model("Chapter", chapterSchema);

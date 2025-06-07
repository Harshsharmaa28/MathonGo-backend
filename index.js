require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const rateLimiter = require("./middlewares/rateLimiter");

const app = express();
connectDB();
app.use(express.json()); 

app.use(rateLimiter);
app.use("/api/v1", require("./routes/chapterRoutes"));

app.listen(process.env?.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

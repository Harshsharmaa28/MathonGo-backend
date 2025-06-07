const redis = require("../config/redis");

module.exports = async (req, res, next) => {
  const key = `chapters:${JSON.stringify(req.query)}`;
  const cached = await redis.get(key);

  if (cached) {
    console.log("🔁 Returning from Redis cache");
    return res.status(200).json(JSON.parse(cached));
  }

  res.sendResponse = res.json;
  res.json = (body) => {
    redis.set(key, JSON.stringify(body), "EX", 3600); // 1 hour TTL
    res.sendResponse(body);
  };

  next();
};

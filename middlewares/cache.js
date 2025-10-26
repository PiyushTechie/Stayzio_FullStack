// middlewares/cache.js
import redisModule from "../utils/redisClient.js";
const { client } = redisModule;

// Default TTL in seconds (1 hour)
const DEFAULT_TTL = 3600;

export async function cacheMiddleware(req, res, next) {
  // Namespaced key: 'listings:/full/path?query=params'
  const key = `listings:${req.originalUrl}`;

  try {
    const cachedData = await client.get(key);

    if (cachedData) {
      console.log(`CACHE HIT ✅ on key: ${key}`);
      return res.json(JSON.parse(cachedData));
    }

    console.log(`CACHE MISS ⚠️ on key: ${key}`);

    // Helper to set cache in your controller
    res.setCache = async (data, expiration = DEFAULT_TTL) => {
      try {
        await client.setEx(key, expiration, JSON.stringify(data));
        console.log(`CACHE SET 🟢 for key: ${key} (TTL: ${expiration}s)`);
      } catch (err) {
        console.error(`Redis SETEX error for key ${key}:`, err);
      }
    };

    next();
  } catch (err) {
    console.error('Redis error:', err);
    next(); // continue without caching if Redis fails
  }
}

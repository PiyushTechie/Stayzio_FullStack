// middlewares/cache.js
import redisModule from "../utils/redisClient.js";
const { client } = redisModule;

const DEFAULT_TTL = 3600;

export async function cacheMiddleware(req, res, next) {
  
  const key = `listings:${req.originalUrl}`;

  try {
    const cachedData = await client.get(key);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    res.setCache = async (data, expiration = DEFAULT_TTL) => {
      try {
        await client.setEx(key, expiration, JSON.stringify(data));
      } catch (err) {
        console.error(`Redis SETEX error for key ${key}:`, err);
      }
    };

    next();
  } catch (err) {
    console.error('Redis error:', err);
    next(); 
  }
}

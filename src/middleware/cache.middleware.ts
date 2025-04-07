import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis.config';
import envVariables from '../config/env.config';

// /**
//  * Cache middleware
//  * @param {number} duration - The duration in seconds of the cache
//  * @returns {function(Request, Response, NextFunction)} - The middleware function
//  */
const {ELASTICACHE_REDIS_URL} = envVariables
export const cacheMiddleware = (durationInSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { shortId } = req.params;

      if (!shortId) return next(); // If no shortId, skip

      const cacheKey = `shorturl:${shortId}`;

      // Try to get cached original URL
      const cachedUrl = await redisClient.get(cacheKey);
      if (cachedUrl) {
        console.log(`🔁 Cache hit for ${shortId} -> ${cachedUrl}`);
        return res.redirect(cachedUrl); // Stop here if cached
      }

      // Intercept res.redirect to cache the redirect target
      const originalRedirect = res.redirect.bind(res);

      res.redirect = function (url: any) {
        redisClient.setEx(cacheKey, durationInSeconds, url)
          .then(() => console.log(`✅ Cached redirect for ${shortId} -> ${url}`))
          .catch((err: any) => console.error(`❌ Failed to cache ${shortId}`, err));

        return originalRedirect(url); // Call the original redirect
      };

      next(); // Go to the controller logic
    } catch (err) {
      console.error('❌ Redis cache middleware error:', err);
      next(); // Continue without cache on error
    }
  };
};

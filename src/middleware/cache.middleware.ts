import { Request, Response, NextFunction } from 'express';
import redisClients from '../config/redis.config';
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
        const redisClient = await redisClients();
       const { shortId } = req.params;
        if (!shortId) next(); // In case it's not the expected route
  
         const cacheKey = `shorturl:${shortId}`;
         const cachedUrl = await redisClient.get(cacheKey);
           if (cachedUrl) {
          console.log(`🔁 Cache hit for ${shortId}`);
           res.redirect(cachedUrl);
           return
        }
  
//         // Hook into res.redirect to cache URL before redirecting
        const originalRedirect = res.redirect.bind(res);
        res.redirect = async (url: any) => {
          await redisClient.setEx(cacheKey, durationInSeconds, url);
          console.log(`✅ Cached redirect for ${shortId}`);
           originalRedirect(url)
           return;
        };
            next();
      } catch (err) {
         console.error('❌ Redis cache middleware error:', err);
          next();
       }
     };
   };
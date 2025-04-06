import {Redis} from "ioredis";
import envVariables from "./env.config";

// export const redisClient = new Redis({
//     host: process.env.REDIS_HOST || 'localhost',
//     port: Number(process.env.REDIS_PORT || 6379),
//     // password: String(process.env.REDIS_PASSWORD),
//     maxRetriesPerRequest: 3
// });

export const redisClient = new Redis.Cluster([{
    host: envVariables.ELASTICACHE_REDIS_URL,
    port: 6379
}], {
    dnsLookup: (address, callback) => callback(null, address),
    redisOptions: {
      tls: {},
    },
  });


redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

export default redisClient;
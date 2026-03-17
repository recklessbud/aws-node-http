const Redis = require('ioredis');
const { default: envVariables } = require('./env.config');

const cacheEndpoint = envVariables.ELASTICACHE_REDIS_URL;
const cachePort = envVariables.REDIS_PORT || 6379;

const isOffline = process.env.IS_OFFLINE === 'true' || process.env.STAGE === 'dev';

let redisClient;

if (cacheEndpoint && !isOffline) {
  console.log(`Initializing Redis Cluster client for: ${cacheEndpoint}:${cachePort}`);

  redisClient = new Redis.Cluster(
    [{ host: cacheEndpoint, port: Number(cachePort) }],
    {
      dnsLookup: (address, callback) => callback(null, address),
      redisOptions: {
        tls: {},
        connectTimeout: 10000,
        reconnectOnError: (err) => err.message.includes('READONLY'),
      },
    }
  );

  redisClient.on('connect', () => console.log('Redis client connected'));
  redisClient.on('ready', () => console.log('Redis client ready'));
  redisClient.on('error', (err) => console.error('Redis Client Error:', err));
  redisClient.on('reconnecting', () => console.log('Redis client reconnecting'));
  redisClient.on('end', () => console.log('Redis client connection ended'));
} else {
  if (isOffline) console.warn('Running offline — Redis client disabled.');
  else console.warn('ELASTICACHE_REDIS_URL not set — Redis client disabled.');
  redisClient = {
    get: async () => null,
    set: async () => {},
    setex: async () => {},
  };
}

module.exports = { redisClient };

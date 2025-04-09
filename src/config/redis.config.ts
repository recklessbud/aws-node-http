import Redis from "ioredis";

const client = new Redis.Cluster(
  [{
    host: process.env.ELASTICACHE_REDIS_URL || 'clustercfg.cluster0.bmgb88.use1.cache.amazonaws.com',
    port: 6379
  }],
  {
    dnsLookup: (address, callback) => callback(null, address),
    redisOptions: {
      tls: {},
      connectTimeout: 20000,
      commandTimeout: 20000,

    },   
    clusterRetryStrategy: (times) => Math.min(times * 100, 2000),
    slotsRefreshTimeout: 2000,
    enableReadyCheck: true, 
  }
);

client.on('error', (err) => console.error('Redis Client Error:', err));
client.on('connect', () => console.log('Successfully connected to Redis'));

export default client;

import { createClient } from 'redis';
import { Cluster } from 'ioredis';
import envVariables from './env.config'; // Adjust path as needed

let redisClient: any;

if (envVariables.STAGE === 'prod') {
  redisClient = new Cluster(
    [
      {
        host: envVariables.ELASTICACHE_REDIS_URL,
        port: 6379,
      },
    ],
    { 
        scaleReads: 'slave', // Optional: for read scaling
        slotsRefreshTimeout: 10000,
        enableAutoPipelining: true,
        dnsLookup: (address, callback) => callback(null, address),
        redisOptions: {
          tls: {
            checkServerIdentity: () => undefined,
          },
          connectTimeout: 10000,
        }, 

    }
  );
  redisClient.on('error', (err: any) => {
    console.error('Redis client error:', err);
  })
} else {
  redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  });

  redisClient.on('error', (err: any) => {
    console.error('Redis client error:', err);
  });

  redisClient.connect().then(() => {
    console.log('Redis client connected locally');
  });  
}
console.log(envVariables.ELASTICACHE_REDIS_URL)

export default redisClient;

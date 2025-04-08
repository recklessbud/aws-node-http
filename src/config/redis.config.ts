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
    dnsLookup: (address, callback) => {
     return callback(null, address);
    },
    redisOptions: {
      tls: {}
    }
   }
  );
  redisClient.on('error', (err: any) => {
    console.error('Redis client error:', err);
  })
  redisClient.on('connect', () => {
    console.log('Successfully connected to Redis cluster');
  });

  redisClient.on('ready', () => {
    console.log('Redis cluster is ready to receive commands');
  });

  redisClient.on('close', () => {
    console.log('Redis cluster connection closed');
  });

  redisClient.on('reconnecting', () => {
    console.log('Reconnecting to Redis cluster...');
  });

  redisClient.on('node error', (error: Error, node: any) => {
    console.error(`Redis Cluster Node ${node.options.host}:${node.options.port} encountered an error:`, error);
  });
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

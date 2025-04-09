import Redis from 'ioredis';
import envVariables from './env.config';

interface RedisNode {
  host: string;
  port: number;
}

// Your cluster nodes
const nodes: RedisNode[] = [
  // Add your actual Redis nodes here
  { host: envVariables.ELASTICACHE_REDIS_URL, port: 6379 },
  { host: envVariables.ELASTICACHE_REDIS_URL, port: 6379 },
  // ...add all nodes
];

const cluster = new Redis.Cluster(nodes, {
  clusterRetryStrategy: (times: number): number => {
    // More robust retry strategy
    const delay = Math.min(times * 200, 5000);
    console.log(`Retrying connection, attempt ${times}, delay: ${delay}ms`);
    return delay;
  },
  redisOptions: {
    connectTimeout: 15000,  // Longer connection timeout
    commandTimeout: 10000,  // Command timeout
    reconnectOnError: (err: Error): boolean => {
      console.log('Redis error:', err);
      // Reconnect on specific errors, like READONLY
      return err.message.includes('READONLY');
    }
  },
  maxRedirections: 10  // Increase redirections limit
});

// Error handling
cluster.on('error', (err: Error) => {
  console.error('Redis Cluster Error:', err);
});

cluster.on('node error', (err: Error, node: any) => {
  console.error(`Redis Node Error (${node.options.host}:${node.options.port}):`, err);
});

cluster.on('connect', (node: any) => {
  console.log(`Connected to Redis Node: ${node.options.host}:${node.options.port}`);
});
export default cluster
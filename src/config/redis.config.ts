// const { createClient } = require('redis');
import { createClient } from "redis";

const handler = async () => {
    // const url = process.env.ELASTICACHE_REDIS_URL;
    const url = 'first-cache-bmgb88.serverless.use1.cache.amazonaws.com'
    const client = createClient({
        socket: {
            host: url,
            port: 6379,
        }
    });
    client.on('error', error => console.error('Redis Client Error:', error));
    client.on('connect', () => console.log('Redis Client Connected!'));

    try {
        await client.connect();
        return client;
    } catch(error) {
        console.error('Error wups', error);
        throw error;
    } finally {
        await client.disconnect();
    }
};


export default handler
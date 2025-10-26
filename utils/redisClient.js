// utils/redisClient.js
import { createClient } from 'redis';

const client = createClient({
  username: 'default',
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: 'redis-18108.c83.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 18108
  }
});

client.on('error', (err) => console.log('Redis Client Error', err));

let isConnected = false;

async function connectRedis() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log('✅ Redis client connected');
  }
}

// ✅ Default export as a single object
export default {
  client,
  connectRedis
};

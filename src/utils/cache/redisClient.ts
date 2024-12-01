import Redis from "redis";

// Creating a Redis client instance
const redisClient = Redis.createClient({
    url: 'redis://localhost:6379',  
});

// Handling Redis connection errors
redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});

export { redisClient };

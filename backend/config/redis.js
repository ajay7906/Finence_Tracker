// import redis from 'redis'
// const redisClient = redis.createClient({
//   url: process.env.REDIS_URL
// });

// redisClient.connect().then(()=>{
//     console.log('Connected to Redis');
// }).catch(console.error);
// export {redisClient}


import redis from "redis";

const redisClient = redis.createClient({
  socket: {
    host: 'redis-10976.c276.us-east-1-2.ec2.redns.redis-cloud.com',
    port: '10976',
  },
  username: 'default',
  password: 'rfqlLvk4EBpKv7o1whgZ51GVJf3cLZ1n',
});

redisClient.connect()
  .then(() => console.log("✅ Connected to Redis"))
  .catch((err) => console.error("❌ Redis connection error:", err));

export { redisClient };

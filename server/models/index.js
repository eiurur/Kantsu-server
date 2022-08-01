const redis = require('redis');

let redisClient = null;
console.log(process.env);
if (process.env.REDIS_URI) {
  redisClient = redis.createClient(process.env.REDIS_URI);
} else {
  redisClient = redis.createClient(6379, 'redis');
}
if (process.env.REDIS_PASSWORD) {
  redisClient.auth(process.env.REDIS_PASSWORD, (err) => {
    if (err) throw err;
  });
}

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});
(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;

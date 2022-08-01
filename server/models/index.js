const bluebird = require('bluebird');
const redis = require('redis');

bluebird.promisifyAll(redis);

let redisClient = null;
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

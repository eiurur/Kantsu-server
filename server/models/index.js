const bluebird = require('bluebird');
const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_URL, {
  no_ready_check: true,
});

redisClient.auth(process.env.REDIS_PASSWORD, function (err) {
  if (err) throw err;
});

redisClient.on('connect', function () {
  console.log('Connected to Redis');
});

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = redisClient;

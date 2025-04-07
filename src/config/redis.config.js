const RedisClustr = require('redis-clustr');
const RedisClient = require('redis');
const envVariables = require('../config/env.config');

const redis = new RedisClustr({
    servers: [
        {
            host: envVariables.default.ELASTICACHE_REDIS_URL,
            port: envVariables.default.REDIS_PORT 
        }
    ],
    createClient: function (port, host){
        return RedisClient.createClient(port, host)
    }
})
redis.on("error", function (err) {
    console.log("Error " + err);    
});

redis.on("connect", function () {
    console.log("connected");
  });
  
redis.get("framework", function (err, reply) {
    console.log("redis.get ", reply);
});


module.exports = redis
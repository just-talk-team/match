const redis = require("redis");
const client = redis.createClient();

export class RedisService {
  constructor() {
    client.on("connect", function () {
      console.log("You are now connected");
    });
  }
}

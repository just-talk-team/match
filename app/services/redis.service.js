const Redis = require("ioredis");

const REDIS_URL = process.env.REDIS_URL | 6379;
const redis = new Redis(REDIS_URL);

function pushUserQueue(user) {
  return redis.lpush("queue", JSON.stringify(user));
}

function popUserQueue() {
  return redis.rpop("queue").then((user) => {
    return JSON.parse(user);
  });
}

function getMatches() {
  return redis.get("matches").then((value) => {
    if (value == null) {
      let matches = {};
      matches.creation = new Date();
      return matches;
    }
    return JSON.parse(value);
  });
}

function setMatches(users) {
  return redis.set("matches", JSON.stringify(users));
}

function cleanAllDatabases() {
  return redis.flushall();
}

module.exports = {
  pushUserQueue,
  popUserQueue,
  getMatches,
  setMatches,
  cleanAllDatabases,
};

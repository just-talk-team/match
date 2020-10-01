const Redis = require("ioredis");

const REDIS_URL = process.env.REDIS_URL | 6379;
const redis = new Redis(REDIS_URL);

function pushUserQueue(user) {
  return redis.lpush("users", JSON.stringify(user));
}

function popUserQueue() {
  return redis.rpop("users").then((user) => {
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
  });
}

function setMatches(users) {
  return redis.set("matches", JSON.stringify(users));
}

function deleteMatches() {
  return redis.del("matches");
}

module.exports = {
  pushUserQueue,
  popUserQueue,
  getMatches,
  setMatches,
  deleteMatches,
};

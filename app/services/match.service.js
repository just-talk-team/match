const rule = require("../configuration/rule.configuration");
const {
  getMatches,
  setMatches,
  deleteMatches,
  popUserQueue,
} = require("../services/redis.service");

async function match() {
  let matches = await getMatches();

  if (isTimeToMatch(matches)) {
    const notificationPairs = selectPairs(matches);
    notifyPairs(notificationPairs);
    deleteMatches();
  } else {
    let user = await popUserQueue();
    addUserToMatches(matches, user);
  }

  console.log(matches);
}

function isTimeToMatch(matches) {
  if (
    new Date().getTime() - matches.creation.getTime() >=
    rule.time.getTime()
  ) {
    return true;
  }

  return false;
}

function selectPairs(matches) {
  const notificationUsers = [];

  for (const userId in matches.keys()) {
    var bestPair = null;
    var bestPoint = 0;

    for (const pair in matches[userId].pairs.keys()) {
      if (matches[pair]) {
        if (matches[userId].pairs[pair] > bestPoint) {
          bestPoint = matches[userId].pairs[pair];
          bestPair = pair;
        }
      }
    }

    if (bestPair) {
      notificationUsers.push([userId, bestPair]);
      delete matches[userId];
      delete matches[bestPair];
    }
  }

  return notificationUsers;
}

function notifyPairs(notificationPairs) {
  for (const pairs in notificationPairs) {
    console.log("Notificacion a pareja: ", pairs);
  }
}

function addUserToMatches(matches, user) {
  if (!matches[user.id]) {
    matches[user.id] = user;
    matches[user.id].pairs = [];
  }
}

module.exports = match;

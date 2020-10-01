const rule = require("../configuration/rule.configuration");
const {
  getMatches,
  setMatches,
  deleteMatches,
  popUserQueue,
} = require("../services/redis.service");

const { compareMatches } = require("../util/user.util");

async function match() {
  let matches = await getMatches();

  if (isTimeToMatch(matches)) {
    const notificationPairs = selectPairs(matches);
    notifyPairs(notificationPairs);
    deleteMatches();
  } else {
    let user = await popUserQueue();
    addUserToMatches(matches, user);
    matches = rateUser(matches, user);
    setMatches(matches);
  }

  console.log(matches);
}

function isTimeToMatch(matches) {
  if (new Date().getTime() - matches.creation.getTime() >= rule().time) {
    return true;
  }

  return false;
}

function selectPairs(matches) {
  const notificationUsers = [];

  for (const userId in Object.keys(matches)) {
    var bestPair = null;
    var bestPoint = 0;

    for (const pair in Object.keys(matches[userId].pairs)) {
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

function rateUser(matches, user) {
  for (const userId in Object.keys(matches)) {
    var count = 0;
    if (!matches[userId].pairs[user.id]) {
      if (
        compareMatches(matches[userId].topics_hear, user.topics_talk) > 0 &&
        compareMatches(matches[userId].segments, user.segments) > 0
      ) {
        count += compareMatches(matches[userId].topics_hear, user.topics_talk);
        count += compareMatches(matches[userId].segments, user.segments);
        if (matches[userId].user_type == "premium") {
          var countPremium = countPremium(matches[userId], user);
          matches[userId].pairs[user.id] =
            matches[userId].pairs[user.id] + countPremium;
        }

        if (user.user_type == "premium") {
          var countPremium = countPremium(user, matches[userId]);
          matches[user.id].pairs[userId] =
            matches[user.id].pairs[userId] + countPremium;
        }

        matches[userId].pairs[user.id] = matches[userId].pairs[user.id] + count;
        matches[user.id].pairs[userId] = matches[user.id].pairs[userId] + count;
      } else {
        continue;
      }
    } else {
      count += compareMatches(matches[userId].topics_hear, user.topics_talk);

      matches[userId].pairs[user.id] = matches[userId].pairs[user.id] + count;
      matches[user.id].pairs[userId] = matches[user.id].pairs[userId] + count;
    }
  }
}

function addUserToMatches(matches, user) {
  if (!matches[user.id]) {
    matches[user.id] = user;
    matches[user.id].pairs = {};
  }
}

function countPremium(premium, free) {
  var count = 0;
  if (
    free.age >= premium.preference.ages[0] &&
    free.age <= premium.preference.ages[1]
  ) {
    count++;
  }

  if (premium.preference.genders.find((gender) => gender == free.gender)) {
    count++;
  }

  if (premium.preference.segments.find((segment) => segment == free.segment)) {
    count++;
  }

  return count;
}

module.exports = match;

const rule = require("../configuration/rule.configuration");
const {
  getMatches,
  setMatches,
  deleteMatches,
  popUserQueue,
} = require("../services/redis.service");

const { compareMatches } = require("../util/user.util");

async function match() {
  var matches = await getMatches();
  if (isTimeToMatch(matches)) {
    console.log("time to match");
    const notificationPairs = selectPairs(matches);
    notifyPairs(notificationPairs);
    deleteMatches();
  } else {
    console.log("not time to match");
    const user = await popUserQueue();
    if (user) {
      matches = addUserToMatches(matches, user);
      matches = rateUser(matches, user);
      console.log(matches);
      setMatches(matches);
    }
  }

  console.log("final match", matches);
}

function isTimeToMatch(matches) {
  console.log(matches);
  if (
    new Date().getTime() - new Date(matches.creation).getTime() >=
    rule().time
  ) {
    return true;
  }

  return false;
}

function selectPairs(matches) {
  const notificationUsers = [];
  const positionKeys = Object.keys(matches);
  for (const position in positionKeys) {
    const userId = positionKeys[position];
    var bestPair = null;
    var bestPoint = 0;

    const positionPairKeys = matches[userId].pairs;
    for (const positionPair in positionPairKeys) {
      const pair = positionPairKeys[positionPair];
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
  const positionKeys = Object.keys(matches);
  for (const position in positionKeys) {
    var userId = positionKeys[position];
    if (userId != "creation" && userId != user.id) {
      var count = 0;
      if (!matches[userId].pairs[user.id]) {
        if (
          compareMatches(matches[userId].topics_hear, user.topics_talk) > 0 &&
          compareMatches(matches[userId].segments, user.segments) > 0
        ) {
          count += compareMatches(
            matches[userId].topics_hear,
            user.topics_talk
          );
          count += compareMatches(matches[userId].segments, user.segments);
          if (matches[userId].user_type == "premium") {
            var countPremium = calculateCountPremium(matches[userId], user);
            matches[userId].pairs[user.id] =
              matches[userId].pairs[user.id] + countPremium;
          }

          if (user.user_type == "premium") {
            var countPremium = calculateCountPremium(user, matches[userId]);
            matches[user.id].pairs[userId] =
              matches[user.id].pairs[userId] + countPremium;
          }

          matches[userId].pairs[user.id] =
            matches[userId].pairs[user.id] + count;
          matches[user.id].pairs[userId] =
            matches[user.id].pairs[userId] + count;
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

  return matches;
}

function addUserToMatches(matches, user) {
  if (!matches[user.id]) {
    matches[user.id] = user;
    matches[user.id].pairs = {};
  }

  return matches;
}

function calculateCountPremium(premium, free) {
  var count = 0;
  if (
    free.age >= premium.preferences.ages[0] &&
    free.age <= premium.preferences.ages[1]
  ) {
    count++;
  }

  if (premium.preferences.genders.find((gender) => gender == free.gender)) {
    count++;
  }

  if (premium.preferences.segments.find((segment) => segment == free.segment)) {
    count++;
  }

  return count;
}

module.exports = match;

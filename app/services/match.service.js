const rule = require("../configuration/rule.configuration");
const {
  getMatches,
  setMatches,
  popUserQueue,
  cleanAllDatabases,
} = require("../services/redis.service");

const { compareMatches } = require("../util/user.util");

const axios = require("axios");

async function match() {
  var matches = await getMatches();
  if (isTimeToMatch(matches)) {
    const notificationPairs = selectPairs(matches);
    notifyPairs(notificationPairs);
    cleanAllDatabases();
  } else {
    const user = await popUserQueue();
    if (user) {
      matches = addUserToMatches(matches, user);
      matches = rateUser(matches, user);
      setMatches(matches);
    }
  }
}

function isTimeToMatch(matches) {
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
  for (const userId in matches) {
    var bestPair = null;
    var bestPoint = 0;

    for (const pair in matches[userId].pairs) {
      if (matches[pair]) {
        if (matches[userId].pairs[pair] > bestPoint) {
          bestPoint = matches[userId].pairs[pair];
          bestPair = pair;
        }
      }
    }

    if (bestPair) {
      notificationUsers.push({
        idFirstPerson: userId,
        idSecondPerson: bestPair,
      });
      delete matches[userId];
      delete matches[bestPair];
    }
  }

  return notificationUsers;
}

function notifyPairs(notificationPairs) {
  notificationPairs.forEach((pair) => {
    axios
      .post(process.env.API_NOTIFICATION_DISCOVERY, pair)
      .then((response) => {
        console.log(`statusCode: ${response.statusCode}`);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  });
}

function rateUser(matches, user) {
  for (const userId in matches) {
    if (userId != "creation" && userId != user.id) {
      var count = 0;
      if (!matches[userId].pairs[user.id]) {
        matches[userId].pairs[user.id] = 0;
        matches[user.id].pairs[userId] = 0;
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

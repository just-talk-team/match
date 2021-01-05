const rule = require("../configuration/rule.configuration");
const {
  getMatches,
  setMatches,
  popUserQueue,
} = require("../services/redis.service");

const { compareMatches } = require("../util/user.util");

const axios = require("axios");

async function match() {
  var matches = await getMatches().catch((error) => {
    console.error(error);
  });

  const notificationPairs = selectPairs(matches);
  notifyPairs(notificationPairs);

  for (const pair in notificationPairs) {
    delete matches[pair.idFirstPerson];
    delete matches[pair.idSecondPerson];
  }
  await setMatches(matches).catch((error) => {
    console.error(error);
  });
}

async function evaluate() {
  var matches = await getMatches().catch((error) => {
    console.error(error);
  });

  const user = await popUserQueue().catch((error) => {
    console.error(error);
  });
  if (user) {
    matches = addUserToMatches(matches, user);
    matches = rateUser(matches, user);
    await setMatches(matches).catch((error) => {
      console.error(error);
    });
  }
}

async function removeDisconnectedUsers() {
  var matches = await getMatches().catch((error) => {
    console.error(error);
  });

  const now = new Date();
  for (const userId in matches) {
    const lastConnection = new Date(matches[userId].lastConnection);
    if (
      now.getTime() - lastConnection.getTime() >=
      rule().timeToRemoveDisconnectedUsersInMiliseconds
    ) {
      delete matches[userId];
    }
  }
  await setMatches(matches).catch((error) => {
    console.error(error);
  });
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
    axios.post(process.env.API_NOTIFICATION_DISCOVERY, pair).catch((error) => {
      console.error(error);
    });
  });
}

function rateUser(matches, user) {
  for (const userId in matches) {
    if (userId != user.id) {
      var count = 0;
      if (!matches[userId].pairs[user.id]) {
        matches[userId].pairs[user.id] = 0;
        matches[user.id].pairs[userId] = 0;
        if (
          compareMatches(matches[userId].topics_talk, user.topics_hear) > 0 &&
          compareMatches(matches[userId].segments, user.segments) > 0
        ) {
          count += compareMatches(
            matches[userId].topics_talk,
            user.topics_hear
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
        count += compareMatches(matches[userId].topics_talk, user.topics_hear);

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
  } else {
    matches[user.id].user_type = user.user_type;
    matches[user.id].badges = user.badges;
    matches[user.id].segments = user.segments;
    matches[user.id].topics_talk = user.topics_talk;
    matches[user.id].preferences = user.preferences;
  }

  matches[user.id].lastConnection = new Date();

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

module.exports = { match, evaluate, removeDisconnectedUsers };

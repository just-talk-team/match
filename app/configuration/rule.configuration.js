function rule() {
  const timeToMatchInSeconds = process.env.TIME_TO_MATCH_IN_SECONDS || 10;
  const timeToRemoveDisconnectedUsersInSeconds =
    process.env.TIME_TO_REMOVE_DISCONNECTED_USERS_IN_SECONDS || 60;

  const rule = {};
  rule.timeToMatchInMiliseconds = 1000 * timeToMatchInSeconds;
  rule.timeToRemoveDisconnectedUsersInMiliseconds =
    1000 * timeToRemoveDisconnectedUsersInSeconds;

  return rule;
}

module.exports = rule;

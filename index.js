const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;

const matchController = require("./app/controllers/match.controller");

const {
  match,
  removeDisconnectedUsers,
} = require("./app/services/match.service");
const rule = require("./app/configuration/rule.configuration");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  let userInfo = req.header("user-agent");
  res.send(`New UserInfo: ${userInfo}`);
});

matchController(app);

app.listen(port, (err) => {
  if (err) {
    console.error("Error: ", err);
    return;
  }
  console.log(`Listening http://localhost:${port}`);
});

setInterval(match, rule().timeToMatchInMiliseconds);
setInterval(
  removeDisconnectedUsers,
  rule().timeToRemoveDisconnectedUsersInMiliseconds
);

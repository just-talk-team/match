const express = require("express");

const { pushUserQueue, popUserQueue } = require("../services/redis.service");
const match = require("../services/match.service");

const { obtainAgeOfBirthday } = require("../util/user.util");

function matchController(app) {
  const router = express.Router();

  app.use("/matches", router);

  router.post("/", async (req, res, next) => {
    let user = req.body;
    user.age = obtainAgeOfBirthday(user.birthday);
    pushUserQueue(user)
      .then(() => {
        setImmediate(match);
      })
      .catch((error) => {
        console.error(
          "Ocurrio un error al momento de registrar usuario en cola.",
          error
        );
      });
    res.sendStatus(200);
  });
}

module.exports = matchController;

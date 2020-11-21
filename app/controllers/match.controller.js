const express = require("express");

const { pushUserQueue, popUserQueue } = require("../services/redis.service");
const { match, evaluate } = require("../services/match.service");

const { obtainAgeOfBirthday } = require("../util/user.util");

function matchController(app) {
  const router = express.Router();

  app.use("/matches", router);

  router.post("/", async (req, res, next) => {
    res.sendStatus(200);

    let user = req.body;
    user.age = obtainAgeOfBirthday(user.birthdate);
    user.register = new Date();

    pushUserQueue(user)
      .then(() => {
        evaluate();
      })
      .catch((error) => {
        console.error(
          "Ocurrio un error al momento de registrar usuario en cola.",
          error
        );
      });
  });
}

module.exports = matchController;

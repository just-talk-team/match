const express = require("express");

function matchController(app) {
  const router = express.Router();

  app.use("/matches", router);

  router.post("/", async (req, res, next) => {
    console.log(req.body);
    res.sendStatus(200);
  });
}

module.exports = matchController;

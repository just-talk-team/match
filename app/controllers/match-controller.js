const express = require("express");

function productsApi(app) {
  const router = express.Router();

  app.use("/matches", router);

  router.get("/", async (req, res, next) => {
    res.send("matches");
  });
}

module.exports = productsApi;

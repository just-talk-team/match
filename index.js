const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const matchController = require("./app/controllers/match-controller");

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

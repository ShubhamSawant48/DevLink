const express = require("express");

const app = express();

app.use("/test", function (req, res) {
  res.send("Hello from /test");
});

app.use("/google", function (req, res) {
  res.send("Hello from /google");
});

app.use("/", function (req, res) {
  res.send("Hello from /");
});

app.listen(7777);

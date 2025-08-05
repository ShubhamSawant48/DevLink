const express = require("express");

const app = express();
const connectDB = require("./config/database");
const User = require("./models/User");

connectDB()
  .then(() => {
    console.log("database connected successfully...");
    app.listen(7777, (req, res) => {
      console.log("server established successfully...");
    });
  })
  .catch((err) => {
    console.log("error occurede while connecting db...");
  });

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "virat",
    lastName: "kholi",
    emailId: "virat@kholi.com",
    password: "virat123",
  });

  try {
    await user.save();
    res.send("user added successfully...");
  } catch (err) {
    res.status(500).send("user unable to add");
  }
});

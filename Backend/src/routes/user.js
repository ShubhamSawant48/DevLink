const express = require("express");
const userRouter = express.Router();

const User = require("../models/User");
const { userAuth } = require("../middlewares/userAuth");


// feed api - get all users from db
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    res.status(500).send("can't find users");
  }
});


module.exports = userRouter;
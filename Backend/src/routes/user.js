const express = require("express");
const userRouter = express.Router();

const User = require("../models/User");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/ConnectionRequests");

const SAFE_DATA = "firstName lastName age gender skills photoURL";

// feed api - get all users from db
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    res.status(500).send("can't find users");
  }
});

userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_DATA);

    res.json({ message: "data fetched successfullly...", data: requests });
  } catch (err) {
    res.json({ message: "error:" + err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_DATA)
      .populate("toUserId", SAFE_DATA);

    const data = requests.map((row)=>{
      if(row.fromUserId._id === loggedInUser._id) return row.toUserId;
      return row.fromUserId;
    })

    res.json({ message: "data fetched successfullly...", data: data });
  } catch (err) {
    res.json({ message: "error: " + err.message });
  }
});

module.exports = userRouter;

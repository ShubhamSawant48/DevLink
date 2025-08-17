const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequestModel = require("../models/ConnectionRequests");
const User = require("../models/User");

const SAFE_DATA = "firstName lastName age gender skills photoURL about";

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

    const data = requests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) return row.toUserId;
      return row.fromUserId;
    });

    res.json({ message: "data fetched successfullly...", data: data });
  } catch (err) {
    res.json({ message: "error: " + err.message });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page-1)*limit;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((user) => {
      hideUsersFromFeed.add(String(user.fromUserId));
      hideUsersFromFeed.add(String(user.toUserId));
    });

    // console.log(connectionRequests)
    // res.send([...hideUsersFromFeed]);

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(SAFE_DATA).skip(skip).limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: "error: " + err.message });
  }
});

module.exports = userRouter;

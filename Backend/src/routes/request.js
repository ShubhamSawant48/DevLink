const express = require("express");
const userAuth = require("../middlewares/userAuth");
const User = require("../models/User");
const ConnectionRequestModel = require("../models/ConnectionRequests");

const requestRouter = express.Router();

requestRouter("/request/send/:status/:userId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "invalid status type : " + status,
      });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "user not found!" });
    }

    const existingConnectionRequest = await ConnectionRequestModel.findOne({
      $OR: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      return res.status(400).json({ message: "connection already exists" });
    }

    const connectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    res.json({
      message: req.user.firstName + " is " + status + " in " + toUser.firstName,
      data,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});


module.exports = requestRouter;
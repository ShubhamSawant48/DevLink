const express = require("express");
const User = require("../models/User");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/userAuth");

// signup api
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req.body);
    const { firstName, lastName, emailId, password } = req.body;

    const duplicateUser = await User.findOne({ emailId: emailId });
    if (duplicateUser) {
      throw new Error("Invalid Credentials");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 3600000),
    });

    await user.save();
    return res.send(user);
  } catch (err) {
    return res.status(500).send("user unable to add: " + err.message);
  }
});

// login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(401).send("Invalid Credentials...");
    }

    const isValidPassword = await user.checkValidPassword(password);
    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 3600000),
      });
      return res.send(user);
    } else {
      return res.status(401).send("Invalid Credentials...");
    }
  } catch (err) {
    return res.status(500).send("unable to login : " + err.message);
  }
});

// logout api
authRouter.post("/logout", userAuth, (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout successful...");
});

module.exports = authRouter;

const express = require("express");
const User = require("../models/User");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt  = require('bcrypt');
const {userAuth}  = require("../middlewares/userAuth")

// signup api
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req.body);
    const { firstName, lastName, emailId, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    await user.save();
    res.send("user added successfully...");
  } catch (err) {
    res.status(500).send("user unable to add: " + err.message);
  }
});

// login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.send("Invalid Credentials...");
    }

    const isValidPassword = await user.checkValidPassword(password);
    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 3600000),
      });
      res.send("Login successful...");
    } else {
      res.send("Invalid Credentials...4");
    }
  } catch (err) {
    res.status(500).send("unable to login : " + err.message);
  }
});

// logout api
authRouter.post("/logout", userAuth,(req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout successful...");
});


module.exports = authRouter;
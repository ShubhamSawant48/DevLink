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
    // In your login/signup route
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: true, // REQUIRED: Only send over HTTPS (Render uses HTTPS)
      sameSite: "None", // REQUIRED: Allows cookie sharing across different domains
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
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
        secure: true, // REQUIRED: Only send over HTTPS
        sameSite: "None", // REQUIRED: Allow cross-site requests
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
authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
});

module.exports = authRouter;

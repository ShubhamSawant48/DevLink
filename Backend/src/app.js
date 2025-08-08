const express = require("express");

const app = express();
const connectDB = require("./config/database");
const User = require("./models/User");
const validateSignUpData = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/userAuth");

connectDB()
  .then(async () => {
    console.log("database connected successfully...");

    await User.syncIndexes();

    app.listen(7777, () => {
      console.log("server established successfully...");
    });
  })
  .catch((err) => {
    console.error("error occurred while connecting db:", err.message);
    process.exit(1);
  });

app.use(express.json());
app.use(cookieParser());

// feed api - get all users from db
app.get("/users", userAuth,async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (err) {
    res.status(500).send("can't find users");
  }
});

// signup api
app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req.body);
    const { firstName, lastName, emailId, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword);

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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.send("Invalid Credentials...");
    }

    const isValidPassword =await user.checkValidPassword(password); 
    if (isValidPassword) {
      const token = await user.getJWT();
      res.cookie("token", token,{expires:new Date(Date.now() + 7 * 3600000)});
      res.send("Login successful...");
    } else {
      res.send("Invalid Credentials...");
    }
  } catch (err) {
    res.status(500).send("unable to login : " + err.message);
  }
});

// get profile info
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.send("error : " + err.message);
  }
});

// get user by email
app.get("/user", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.emailId });

    res.send(user);
  } catch (err) {
    res.status(500).send("can't find users");
  }
});

// delete user from db
app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.userId);

    res.send("user deleted successfully!");
  } catch (err) {
    res.status(500).send("deleting didn't happen!");
  }
});

// update user from db
app.patch("/user/:userId", async (req, res) => {
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "skills",
    ];
    const isAllowedKeys = Object.keys(req.body).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isAllowedKeys) {
      throw new Error("updation not allowed");
    }
    if (req.body.skills.length > 10) {
      throw new Error("skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate(req.params?.userId, req.body, {
      returnDocument: "before",
      runValidators: true,
    });
    // console.log(user);
    res.send("user updated successfully!");
  } catch (err) {
    res.status(500).send("updating didn't happen! " + err.message);
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.send("something went wrong...last");
  }
});

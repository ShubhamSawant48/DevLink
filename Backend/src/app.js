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

const authRouter = require("./routes/auth");
// const connectionRequestRouter = require("./routes/connectionRequest");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");

app.use("/",authRouter);
// app.use("/",connectionRequestRouter);
app.use("/",profileRouter);
app.use("/",userRouter);
app.use("/", (err, req, res, next) => {
  if (err) {
    res.send("something went wrong...last");
  }
});
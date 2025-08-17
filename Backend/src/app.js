const express = require("express");

const app = express();
const connectDB = require("./config/database");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const http = require('http');
require('dotenv').config();

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());



const authRouter = require("./routes/auth");
const connectionRequestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const initializeSocket  = require("./utils/socket");

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(async () => {
    console.log("database connected successfully...");

    await User.syncIndexes();

    server.listen(process.env.PORT, () => {
      console.log("server established successfully...");
    });
  })
  .catch((err) => {
    console.error("error occurred while connecting db:", err.message);
    process.exit(1);
  });

app.use("/",authRouter);
app.use("/",connectionRequestRouter);
app.use("/",profileRouter);
app.use("/",userRouter);
app.use("/", (err, req, res, next) => {
  if (err) {
    console.error(err.stack);
    res.send("something went wrong...last");
  }
});




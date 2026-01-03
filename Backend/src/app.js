const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

// 1. CORS middleware FIRST
app.use(cors({
  origin: ["https://devlink-blush.vercel.app","http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// 2. Body parsers
app.use(express.json());
app.use(cookieParser());

// 3. Import routers
const authRouter = require("./routes/auth");
const connectionRequestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const initializeSocket = require("./utils/socket");

// 4. Register routes
app.use("/", authRouter);
app.use("/", connectionRequestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

// 5. Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

// 6. Create server
const server = http.createServer(app);
initializeSocket(server);

// 7. Connect to database and start server
connectDB()
  .then(async () => {
    console.log("database connected successfully...");
    await User.syncIndexes();

    server.listen(process.env.PORT, () => {
      console.log("server established successfully...");
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
    process.exit(1);
  });
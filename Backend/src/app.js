const express = require("express");

const app = express();
const connectDB = require("./config/database");
const User = require("./models/User");

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

// feed api - get all users from db
app.get("/users", async (req, res) => {
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
    const user = new User(req.body);
    await user.save();
    res.send("user added successfully...");
  } catch (err) {
    res.status(500).send("user unable to add: " + err.message);
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
    const user = await User.findByIdAndUpdate(req.params?.userId, req.body, {
      returnDocument: "before",
      runValidators: true,
    });
    console.log(user);
    res.send("user updated successfully!");
  } catch (err) {
    res.status(500).send("updating didn't happen! " + err.message);
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.send("something went wrong...");
  }
});

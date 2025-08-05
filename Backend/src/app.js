const express = require("express");

const app = express();
const connectDB = require("./config/database");
const User = require("./models/User");

connectDB()
  .then(() => {
    console.log("database connected successfully...");
    app.listen(7777, (req, res) => {
      console.log("server established successfully...");
    });
  })
  .catch((err) => {
    console.log("error occured while connecting db...");
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
  const user = new User(req.body);

  try {
    await user.save();
    res.send("user added successfully...");
  } catch (err) {
    res.status(500).send("user unable to add");
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
app.patch("/user", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.userId,req.body,{returnDocument:"before",});
    console.log(user)
    res.send("user updated successfully!");
  } catch (err) {
    res.status(500).send("updating didn't happen!");
  }
});
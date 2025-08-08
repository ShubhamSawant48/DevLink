const express = require("express");
const profileRouter = express.Router();

const {userAuth} = require("../middlewares/userAuth");
const { validateEditProfileData } = require("../utils/validation");

// get profile info
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.send("error : " + err.message);
  }
});

// update user from db
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isAllowedKeys = validateEditProfileData(req);
    if (!isAllowedKeys) {
      throw new Error("updation not allowed");
    }
    if (req.body.skills?.length > 10) {
      throw new Error("skills cannot be more than 10");
    }
    const loggedInUser = req.user;
    // console.log(user);
    Object.keys(req.body).every((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.send("user updated successfully!");
  } catch (err) {
    res.status(500).send("updating didn't happen! " + err.message);
  }
});

// delete user from db
// app.delete("/user", async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.body.userId);

//     res.send("user deleted successfully!");
//   } catch (err) {
//     res.status(500).send("deleting didn't happen!");
//   }
// });

module.exports = profileRouter;

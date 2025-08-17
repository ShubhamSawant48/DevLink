const User = require("../models/User");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Authorized token expired...Login again!");
    }

    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decodedMessage;
    const user = await User.findById(id);
    if(!user){
        return res.status(404).send("User not found..")
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("Authorized token expired...Login again!");
  }
};

module.exports = {
  userAuth,
};

const mongoose = require("mongoose");
var validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("emailId is not valid!");
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter valid password!");
        }
      },
    },
    age: {
      type: String,
      min: 18,
      max: 75,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender is not valid!");
        }
      },
    },
    skills: {
      type: [String],
    },
    photoURL: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("photoURL is not valid!");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ id: user._id }, "devTinder@123",{expiresIn: "7d"});

  return token;
}

userSchema.methods.checkValidPassword = async function (userInputPassword) {
  const user = this;
  const isValidPassword = await bcrypt.compare(userInputPassword, user.password);
  return isValidPassword;
}

module.exports = mongoose.model("User", userSchema);

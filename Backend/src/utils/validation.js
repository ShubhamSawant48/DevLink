const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("email id is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not valid!");
  }
  // else if(!validator.isURL(photoURL)){
  //     throw new Error("photo URL is not valid!");
  // }
};

const validateEditProfileData = (req) => {
  const allowedKeys = [
    "firstName",
    "lastName",
    "password",
    "age",
    "gender",
    "skills",
    "photoURL",
  ];
  const isUpdateAllow = Object.keys(req.body).every((field) =>
    allowedKeys.includes(field)
  );
  return isUpdateAllow;
};

module.exports = { validateSignUpData, validateEditProfileData };

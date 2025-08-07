const validator = require('validator');

const validateSignUpData = (req) => {
    const {firstName, lastName,emailId,password} = req;

    if(!firstName || !lastName){
        throw new Error("Name is not valid!");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("email id is not valid!");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("password is not valid!");
    }
    // else if(!validator.isURL(photoURL)){
    //     throw new Error("photo URL is not valid!");
    // }
}

module.exports = validateSignUpData
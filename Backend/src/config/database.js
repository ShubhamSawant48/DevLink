const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://sawantshubham736:8O1VpbdXzsVAXEGw@namastenodejs.pp4h1jb.mongodb.net/devLink")
}

module.exports = connectDB;
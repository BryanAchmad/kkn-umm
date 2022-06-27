const mongoose = require("mongoose")

const User = new mongoose.model(
    "User", 
    new mongoose.Schema({
        nama: { type: String, default:null },
        email: { type: String, unique: true },
        password: {type: String },
        token: { type: String },
    })
);

module.exports = User;
const mongoose = require("mongoose")

const User = new mongoose.model(
    "User", 
    new mongoose.Schema({
        mahasiswa: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Mahasiswa"
            }
        ],
        kelompok: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Kelompok"
            }
        ],
        access_token: { type: String },
    })
);

module.exports = User;
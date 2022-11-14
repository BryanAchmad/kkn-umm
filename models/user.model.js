const mongoose = require("mongoose");

const User = new mongoose.model(
    "User",
    new mongoose.Schema({
        // user: { type: String, unique: true },
        nim: { type: String },
        idMahasiswa: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mahasiswa",
        },
        kelompok: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Kelompok",
        },
        access_token: { type: String, select: false },
    })
);

module.exports = User;

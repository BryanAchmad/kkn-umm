const mongoose = require("mongoose");

const Proker = new mongoose.model(
    "Proker",
    new mongoose.Schema({
        title: {type: String },
        divisi: { type: String },
        deskripsi: { type: String},
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    })
);

module.exports = Proker;
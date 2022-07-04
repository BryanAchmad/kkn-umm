const mongoose = require("mongoose");

const Divisi = new mongoose.model(
    "Divisi",
    new mongoose.Schema(
        {
            nama: { type: String, required: true },
            deskripsi: { type: String },
            id_kelompok: { type: String },
        },
        {
            timestamps: {
                createdAt: "created_at",
                updatedAt: "updated_at",
            },
        }
    )
);

module.exports = Divisi;

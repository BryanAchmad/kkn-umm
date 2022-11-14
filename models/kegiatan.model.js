const mongoose = require("mongoose");

const Kegiatan = new mongoose.model(
    "Kegiatan",
    new mongoose.Schema(
        {
            judul_kegiatan: { type: String },
            tanggal_kegiatan: { type: String },
            deskripsi: { type: String },
            images: { type: [Object] },
        },
        {
            timestamps: {
                createdAt: "created_at",
                updatedAt: "updated_at",
            },
        }
    )
);

module.exports = Kegiatan;

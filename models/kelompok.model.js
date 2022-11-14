const mongoose = require("mongoose");

const Kelompok = new mongoose.model(
    "Kelompok",
    new mongoose.Schema(
        {
            no_kelompok: Number,
            lokasi: String,
            proker: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Proker",
                },
            ],
            laporan: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Laporan",
            },
            profilDesa: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ProfilDesa",
            },
        },
        {
            timestamps: {
                createdAt: "created_at",
                updatedAt: "updated_at",
            },
        }
    )
);

module.exports = Kelompok;

const mongoose = require("mongoose");

const ProfilDesa = new mongoose.model(
    "ProfilDesa",
    new mongoose.Schema(
        {
            no_kelompok: { type: Number },
            profilDesa: { type: [Object] },
            status: { type: Boolean, default: false },
        },
        {
            timestamps: {
                createdAt: "created_at",
                updatedAt: "updated_at",
            },
        }
    )
);

module.exports = ProfilDesa;

const mongoose = require("mongoose");

const Laporan = new mongoose.model(
    "Laporan",
    new mongoose.Schema(
        {
            no_kelompok: { type: Number },
            laporan: { type: [Object] },
            status: { type: Boolean, default: false },
            media: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Media",
                },
            ],
        },
        {
            timestamps: {
                createdAt: "created_at",
                updatedAt: "updated_at",
            },
        }
    )
);

module.exports = Laporan;

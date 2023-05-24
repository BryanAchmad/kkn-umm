const mongoose = require("mongoose");

const Media = new mongoose.model(
    "Media",
    new mongoose.Schema(
        {
            no_kelompok: { type: Number },
            link: { type: String },
        },
        {
            timestamps: {
                createdAt: "created_at",
                updatedAt: "updated_at",
            },
        }
    )
);

module.exports = Media;
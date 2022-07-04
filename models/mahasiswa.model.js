const mongoose = require("mongoose");

const Mahasiswa = new mongoose.model(
    "Mahasiswa",
    new mongoose.Schema(
        {
            nim: { type: String, required: true, unique: true },
            nama: { type: String },
            pic: { type: String },
            jurusan: { type: String },
            fakultas: { type: String },
            nilai: { type: String, default: "X" },
            isAccess: { type: Boolean, default: false },
            kelompok: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Kelompok",
                },
            ],
            access_token: { type: String },
        },
        {
            timestamps: {
                createdAt: "created_at",
                updatedAt: "updated_at",
            },
        }
    )
);

module.exports = Mahasiswa;

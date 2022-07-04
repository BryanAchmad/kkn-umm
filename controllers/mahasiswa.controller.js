const bcrypt = require("bcryptjs");
const db = require("../models");
const Mahasiswa = db.mahasiswa;
const jsonResponse = require("../libs/jsonResponse");

exports.create = async (req, res) => {
    const { nim, nama, pic, jurusan, fakultas, nilai, isAccess } = req.body;

    try {
        encryptedPic = await bcrypt.hash(pic, 10);
        const mahasiswa = new Mahasiswa({
            nim,
            nama,
            pic: encryptedPic,
            jurusan,
            fakultas,
            nilai,
            isAccess,
        });

        // encryptedPic = await bcrypt.hash(pic, 10);
        const saveMahasiswa = await mahasiswa.save();
        if (!saveMahasiswa) jsonResponse.error(req, res, "failed", 400);

        if (saveMahasiswa.isAccess) {
            const saveToUser = await User.findByIdAndUpdate(
                id,
                { $push: { mahasiswa: saveMahasiswa._id } },
                { new: true, useFindAndModify: false }
            );
            if (!saveToUser) jsonResponse.error(req, res, "failed", 400);
        }

        const saveToKelompok = await Kelompok.findByIdAndUpdate(
            id,
            { $push: { mahasiswa: saveMahasiswa._id } },
            { new: true, useFindAndModify: false }
        );

        if(!saveToKelompok && !saveMahasiswa && !saveToUser)

        jsonResponse.success(req, res, "success", saveMahasiswa);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

exports.getByKelompok = async (req, res) => {
    const { kelompok } = req.params;

    try {
        const mahasiswa = await Mahasiswa.find({ kelompok: kelompok });
        if (!mahasiswa) jsonResponse.error(req, res, "failed", 400);

        jsonResponse.success(req, res, "success", mahasiswa);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;

    try {
        const mahasiswa = await Mahasiswa.findById(id);
        if (!mahasiswa) jsonResponse.error(req, res, "failed", 400);

        jsonResponse.success(req, res, "success", mahasiswa);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const mahasiswa = await Mahasiswa.findByIdAndRemove(id);
        if (!mahasiswa) jsonResponse.error(req, res, "failed", 400);

        jsonResponse.success(req, res, "success", mahasiswa);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

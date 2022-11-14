const bcrypt = require("bcryptjs");
const db = require("../models");
const Mahasiswa = db.mahasiswa;
const Kelompok = db.kelompok;
const jsonResponse = require("../libs/jsonResponse");

exports.create = async (req, res) => {
    const { nim, nama, pic, jurusan, fakultas, nilai } = req.body;

    try {
        encryptedPic = await bcrypt.hash(pic, 10);
        const mahasiswa = new Mahasiswa({
            nim,
            nama,
            pic: encryptedPic,
            jurusan,
            fakultas,
            nilai,
        });

        // encryptedPic = await bcrypt.hash(pic, 10);
        const saveMahasiswa = await mahasiswa.save();
        if (!saveMahasiswa) jsonResponse.error(req, res, "failed", 400);

        // if (saveMahasiswa.isAccess) {
        //     const saveToUser = await User.findByIdAndUpdate(
        //         id,
        //         { $push: { mahasiswa: saveMahasiswa._id } },
        //         { new: true, useFindAndModify: false }
        //     );
        //     if (!saveToUser) jsonResponse.error(req, res, "failed", 400);
        // }
        jsonResponse.success(req, res, "success", saveMahasiswa);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

exports.getByKelompok = async (req, res) => {
    const { kelompok } = req.params;

    try {
        // const dataKelompok = await Kelompok.find({ no_kelompok: kelompok });
        // if (!dataKelompok)
        //     jsonResponse.error(
        //         req,
        //         res,
        //         "Kelompok you search is not found",
        //         400
        //     );

        // console.log("datakelompok => ", dataKelompok);
        const mahasiswa = await Mahasiswa.find({}).where({'kelompok.no_kelompok' : kelompok}).populate({
            path: "kelompok"
        }).exec();

        console.log(mahasiswa);
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
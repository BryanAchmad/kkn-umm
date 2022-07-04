const db = require("../models");
const Divisi = db.divisi;
const jsonResponse = require("../libs/jsonResponse");

exports.create = async (req, res) => {
    const { nama, deskripsi } = req.body;
    const { id_kelompok } = req.params;

    try {
        const divisi = new Divisi({
            nama,
            deskripsi,
        });

        const saveDivisi = await divisi.save();
        if (!saveDivisi) throw new Error();

        jsonResponse.success(req, res, "success", saveDivisi);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

exports.get = async (req, res) => {
    try {
        const getDivisi = await Divisi.find({});
        if (!getDivisi) throw new Error();

        jsonResponse.success(req, res, "success", getDivisi);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

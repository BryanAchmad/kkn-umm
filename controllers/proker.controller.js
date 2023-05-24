const mongoose = require("mongoose");
const db = require("../models");
const Proker = db.proker;
const Kelompok = db.kelompok;
const jsonResponse = require("../libs/jsonResponse");

//create proker using update Kelompok schema, send kelompok id to update field proker
exports.create = async (req, res) => {
    const { id } = req.params;
    const { title, divisi, deskripsi } = req.body;

    try {
        const proker = new Proker({
            title,
            divisi,
            deskripsi,
        });

        const saveProker = await proker.save();
        if (!saveProker)
            jsonResponse.error(req, res, "Failed to save proker", 400);

        const saveToKelompok = await Kelompok.findByIdAndUpdate(
            id,
            { $push: { proker: saveProker._id } },
            { new: true, useFindAndModify: false }
        );
        if (!saveToKelompok)
            jsonResponse.error(
                req,
                res,
                "Failed to update data in kelompok",
                400
            );

        jsonResponse.success(req, res, "Success to save data", saveToKelompok);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//fetch proker by kelompok using Kelompok Schema and populate proker field
exports.fetchAll = async (req, res) => {
    console.log("fetched =", new Date());
    const { id } = req.params;
    console.log(id);
    // const _id = { _id: ObjectID(id) };
    try {
        // {'_id': ObjectID(myId)}
        const _id = await mongoose.Types.ObjectId(id);
        const proker = await Kelompok.findById(id)
            .select("proker -_id")
            .populate({ path: "proker", populate: { path: "kegiatan" } })
            .exec();
        res.status(200).json(proker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.fetchOne = async (req, res) => {
    const { id } = req.params;
    try {
        const proker = await Proker.findById(id).populate("kegiatan");
        if (!proker) jsonResponse.error(req, res, "Proker not found", 400);

        jsonResponse.success(req, res, "Success to get proker", proker);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

//update proker using id proker
exports.update = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        const proker = await Proker.findByIdAndUpdate(id, req.body, {
            useFindAndModify: false,
        });
        if (!proker)
            return res.status(400).json({ message: "something was wrong" });

        res.status(200).json(proker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//delete proker using id proker
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const proker = await Proker.findByIdAndRemove(id);
        if (!proker) return res.status(400).json({ message: "id not found " });

        res.status(200).json({ message: "successfully remove" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.truncate = async (req, res) => {
    // const { id } = req.params;

    try {
        const proker = await Proker.deleteMany();
        if (!proker)
            return res.status(400).json({ message: "failed delete data" });

        res.status(200).json({ message: "successfully remove all datas" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

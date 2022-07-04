const mongoose = require("mongoose");
const db = require("../models");
const Proker = db.proker;
const Kelompok = db.kelompok;
const jsonResponse = require("../libs/jsonResponse");

//create proker using update Kelompok schema, send kelompok id to update field proker
exports.create = async (req, res) => {
    const { id } = req.params;
    const { title, divisi, deskripsi } = req.body

    try {
        const proker = new Proker({
            title,
            divisi,
            deskripsi,
        });

        const saveProker = await proker.save();
        if(!saveProker)
            jsonResponse.error(req, res, message.error_create, 400)
        //only save _id proker in Kelompok Schema
        const saveToKelompok = await Kelompok.findByIdAndUpdate(
            id,
            { $push: { proker: saveProker._id } },
            { new: true, useFindAndModify: false }
        )
        if(!saveToKelompok)
            jsonResponse.error(req, res, message.error_create, 400)

        jsonResponse.success(req, res, message.success_create, saveToKelompok)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
};

//fetch proker by kelompok using Kelompok Schema and populate proker field
exports.fetchAll = async (req, res) => {
    const { id } = req.params

    try {
        const proker = await Kelompok.findById(id).select("proker -_id").populate({ path: "proker", populate: { path: "kegiatan" } }).exec()
        res.status(200).json(proker);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//update proker using id proker
exports.update = async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        const proker = await Proker.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
        if(!proker)
            return res.status(400).json({message: "something was wrong"})

        res.status(200).json(proker);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//delete proker using id proker
exports.delete = async (req, res) => {
    const { id } = req.params
    
    try {
        const proker = await Proker.findByIdAndRemove(id)
        if(!proker)
            return res.status(400).json({ message: "id not found "})

        res.status(200).json({ message: "successfully remove" })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}
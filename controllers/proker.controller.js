const mongoose = require("mongoose");
const db = require("../models");
const Proker = db.proker;
const Kelompok = db.kelompok;

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
        const saveToKelompok = await Kelompok.findByIdAndUpdate(
            id,
            { $push: { proker: saveProker._id } },
            { new: true, useFindAndModify: false }
        )

        res.status(200).json(saveToKelompok)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
};

exports.fetchAll = async (req, res) => {
    const { id } = req.params

    try {
        const proker = await Kelompok.findById(id).select("proker -_id").populate("proker").exec()
        res.status(200).json(proker);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.delete = async (req, res) => {
    const { id } = req.params
    
    try {
        const proker = await Proker.findOneAndRemove()
    } catch (error) {

    }
}
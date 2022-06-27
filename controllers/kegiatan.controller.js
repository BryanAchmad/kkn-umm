const db = require("../models");
const Kegiatan = db.kegiatan;
const Proker = db.proker;

exports.create = async (req, res) => {
    const { id } = req.params
    const { judul_kegiatan, tanggal_kegiatan, deskripsi } = req.body

    try {
        const kegiatan = new Kegiatan({
            judul_kegiatan,
            tanggal_kegiatan,
            deskripsi
        })

        const saveKegiatan = await kegiatan.save()
        const saveToProker = await Proker.findByIdAndUpdate(
            id,
            { $push: { kegiatan: saveKegiatan._id } },
            { new: true, useFindAndModify: false }
        )

        res.status(200).json(saveToProker)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.update = async (req, res) => {
    const { id } = req.params
    const { judul_kegiatan, tanggal_kegiatan, deskripsi } = req.body

    try {

    } catch (error) {

    }
}

exports.delete = async (req, res) => {
    const { id } = req.params

    try {
        const kegiatan = await Kegiatan.findByIdAndRemove(id)

        res.status(200).json({ message: `data berhasil dihapus`});
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}
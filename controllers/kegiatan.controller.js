const db = require("../models");
const Kegiatan = db.kegiatan;
const Proker = db.proker;
const Kelompok = db.kelompok;

//create kegiatan using update Proker, using proker id to create kegiatan
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
        //only save id of kegiatan in Proker Schema
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

//fetch data kgiatan based on id proker, and only show field kegiatan
exports.getByKelompok = async (req, res) => {
    const { kelompok, idProker  } = req.params

    try {
        const proker = await Proker.findById(idProker).select("kegiatan -_id").populate("kegiatan").exec()

        res.status(200).json(proker)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

//update kegiatan using id kegiatan
exports.update = async (req, res) => {
    const { id } = req.params
    const { judul_kegiatan, tanggal_kegiatan, deskripsi } = req.body

    try {

    } catch (error) {

    }
}

//delete kegiatan using id kegiatan
exports.delete = async (req, res) => {
    const { id } = req.params

    try {
        const kegiatan = await Kegiatan.findByIdAndRemove(id)

        res.status(200).json({ message: `data berhasil dihapus`});
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
}
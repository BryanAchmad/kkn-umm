const db = require("../models");
const Kegiatan = db.kegiatan;
const Proker = db.proker;
const Kelompok = db.kelompok;
const jsonResponse = require("../libs/jsonResponse");

exports.uploadFile = async (req, res, next) => {
    console.log("upload file");
    const { id } = req.params;

    try {
        const multipleImage = [];
        req.files.forEach((element) => {
            console.log(element);
            const img = {
                fileName: element.originalname,
                filePath: element.path,
                fileType: element.mimetype,
                fileZise: fileSizeFormatter(element.size, 2),
            };
            multipleImage.push(img);
        });
        const kegiatan = new Kegiatan({
            judul_kegiatan: req.body.judul_kegiatan,
            tanggal_kegiatan: new Date(req.body.tanggal_kegiatan).toISOString(),
            deskripsi: req.body.deskripsi,
            images: multipleImage,
        });

        const saveKegiatan = await kegiatan.save();

        const saveToProker = await Proker.findByIdAndUpdate(
            id,
            { $push: { kegiatan: saveKegiatan._id } },
            { new: true, useFindAndModify: false }
        );

        jsonResponse.success(req, res, "Succes", saveKegiatan);

        // res.status(200).json(saveToProker)
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const fileSizeFormatter = (bytes, decimal) => {
    if (bytes === 0) {
        return "0 Bytes";
    }
    const dm = decimal || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1000));
    return (
        parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) +
        " " +
        sizes[index]
    );
};

//create kegiatan using update Proker, using proker id to create kegiatan
exports.create = async (req, res) => {
    const { id } = req.params;
    const { judul_kegiatan, tanggal_kegiatan, deskripsi } = req.body;

    try {
        const kegiatan = new Kegiatan({
            judul_kegiatan,
            tanggal_kegiatan,
            deskripsi,
        });

        const saveKegiatan = await kegiatan.save();
        //only save id of kegiatan in Proker Schema
        const saveToProker = await Proker.findByIdAndUpdate(
            id,
            { $push: { kegiatan: saveKegiatan._id } },
            { new: true, useFindAndModify: false }
        );

        jsonResponse.success(req, res);

        res.status(200).json(saveToProker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//fetch data kgiatan based on id proker, and only show field kegiatan
exports.getByKelompok = async (req, res) => {
    const { idProker } = req.params;

    try {
        const proker = await Proker.findById(idProker)
            .select("kegiatan -_id")
            .populate("kegiatan")
            .exec();

        res.status(200).json(proker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//update kegiatan using id kegiatan
exports.update = async (req, res) => {
    const { id } = req.params;
    // const { judul_kegiatan, tanggal_kegiatan, deskripsi } = req.body

    try {
        const kegiatan = await Kegiatan.findByIdAndUpdate(id, req.body, {
            useFindAndModify: false,
        });
        if (!kegiatan)
            return res.status(400).json({ message: "Oops, data not found" });

        res.status(200).json(kegiatan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//delete kegiatan using id kegiatan
exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        const kegiatan = await Kegiatan.findByIdAndRemove(id);
        if (!kegiatan)
            return res.status(400).json({ message: "Opps, data not found" });

        res.status(200).json({ message: "successfully removed" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

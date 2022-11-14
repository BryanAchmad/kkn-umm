const db = require("../models");
const ProfilDesa = db.profilDesa;
const Kelompok = db.kelompok;
const jsonResponse = require("../libs/jsonResponse");

exports.create = async (req, res) => {
    const { id } = req.params;
    console.log(req.file);
    try {
        const profilDesa = new ProfilDesa({
            no_kelompok: req.body.no_kelompok,
            profilDesa: {
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize: fileSizeFormatter(req.file.size, 2),
            },
            status: true,
        });

        const saveProfilDesa = await profilDesa.save();
        if (!saveProfilDesa) {
            jsonResponse.error(req, res, "Upload failed", 400);
        }

        const saveToKelompok = await Kelompok.findByIdAndUpdate(
            id,
            { profilDesa: saveProfilDesa },
            { new: true, useFindAndModify: false }
        );

        jsonResponse.success(req, res, "successfully uploaded", saveProfilDesa);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteProfilDesa = await ProfilDesa.findByIdAndUpdate(id);
        if (!deleteProfilDesa) {
            jsonResponse.error(req, res, "failed to delete");
        }

        jsonResponse.success(req, res, "Successfully removed", []);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400, []);
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

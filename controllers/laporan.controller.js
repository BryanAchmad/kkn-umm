const db = require("../models");
const Laporan = db.laporan;
const Kelompok = db.kelompok;
const jsonResponse = require("../libs/jsonResponse");

exports.create = async (req, res) => {
    const { id } = req.params;
    console.log(req.file);
    try {
        const laporan = new Laporan({
            no_kelompok: req.body.no_kelompok,
            laporan: {
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType: req.file.mimetype,
                fileSize: fileSizeFormatter(req.file.size, 2),
            },
            status: true,
        });

        const saveLaporan = await laporan.save();
        console.log(saveLaporan);
        if (!saveLaporan) {
            jsonResponse.error(req, res, "Upload failed", 400);
        }

        const saveToKelompok = await Kelompok.findByIdAndUpdate(
            id,
            { laporan: saveLaporan },
            { new: true, useFindAndModify: false }
        );
        console.log("save to kelompok => ", saveToKelompok);

        jsonResponse.success(
            req,
            res,
            "Laporan akhir successfully uploaded",
            saveLaporan
        );
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteLaporan = await Laporan.findByIdAndRemove(id);
        if (!deleteLaporan) {
            jsonResponse.error(req, res, "failed to delete laporan");
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

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const laporan = await Laporan.findById(id)
            // .select("-__v")
            .populate("media");

        if (!laporan) {
            jsonResponse.error(req, res, "failed to get data", 400);
        }

        jsonResponse.success(req, res, "Success", laporan);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

exports.fetchAll = async (req, res) => {
    const { idKelompok } = req.params;
    try {
        const laporan = await Kelompok.findById(idKelompok)
            .select("laporan")
            .populate("laporan")
            .exec();

        console.log(laporan);
        // if (!laporan) {
        //     jsonResponse.error(req, res, "Failed to get data", 400);
        // }

        jsonResponse.success(req, res, "success", laporan);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

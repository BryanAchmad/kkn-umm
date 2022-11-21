const db = require("../models");
const Media = db.media;
const Laporan = db.laporan;
const jsonResponse = require("../libs/jsonResponse");

exports.create = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    try {
        const media = new Media({
            no_kelompok: req.body.no_kelompok,
            link: req.body.link,
        });

        const saveMedia = await media.save();
        if (!saveMedia) {
            jsonResponse.error(req, res, "Upload failed", 400);
        }

        const saveToLaporan = await Laporan.findByIdAndUpdate(
            id,
            { $push: { media: saveMedia._id } },
            { new: true, useFindAndModify: false }
        );

        jsonResponse.success(
            req,
            res,
            "Laporan akhir successfully uploaded",
            saveMedia
        );
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

exports.getByKelompok = async (req, res) => {
    const { id } = req.params;

    try {
        const getByKelompok = await Media.find({ no_kelompok: id });
        if (!getByKelompok) {
            return jsonResponse.error(
                req,
                res,
                "failed to get Media Publikasi"
            );
        }

        jsonResponse.success(req, res, "success", getByKelompok);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

exports.delete = async (req, res) => {
    const { idMedia, idLaporan } = req.params;
    try {
        const deleteMedia = await Media.findByIdAndRemove(idMedia);
        if (!deleteMedia) {
            jsonResponse.error(req, res, "failed to delete laporan");
        }

        const deleteFromLaporan = await Laporan.findByIdAndUpdate(idLaporan, {
            $pull: { media: { _id: idMedia } },
        });

        jsonResponse.success(req, res, "Successfully removed", []);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400, []);
    }
};

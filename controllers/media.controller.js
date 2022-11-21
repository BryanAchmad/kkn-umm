const db = require("../models");
const Media = db.media;
const Kelompok = db.kelompok;
const jsonResponse = require("../libs/jsonResponse");

exports.create = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);

    const media = new Media({
        no_kelompok: req.body.no_kelompok,
        link: req.body.link,
    });

    try {
        const saveMedia = await media.save();
        if (!saveMedia) {
            jsonResponse.error(req, res, "Upload failed", 400);
        }

        const saveToKelompok = await Kelompok.findByIdAndUpdate(
            id,
            { $push: { media: saveMedia._id } },
            { new: true, useFindAndModify: false }
        );

        if (!saveToKelompok) {
            await Media.findByIdAndRemove(saveMedia._id);
            jsonResponse.error(req, res, error.message, 400);
        }

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
    const { kelompok } = req.params;

    try {
        const getByKelompok = await Media.find({
            no_kelompok: kelompok,
        }).select("_id link created_at");
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
    const { media, kelompok } = req.params;
    try {
        const deleteMedia = await Media.findByIdAndRemove(media);
        if (!deleteMedia) {
            jsonResponse.error(req, res, "failed to delete laporan");
        }

        const deleteFromKelompok = await Kelompok.findByIdAndUpdate(kelompok, {
            $pull: { media: { _id: media } },
        });

        jsonResponse.success(req, res, "Successfully removed", []);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400, []);
    }
};

const db = require("../models");
const Kelompok = db.kelompok;
const jsonResponse = require("../libs/jsonResponse");
const User = db.user;

const message = {
    error_create: "Opps, something was wrong when saving data",
    success_create: "Successfully save data to the server",
    error_get: "Oops, something was wrong when get data from the server",
    success_get: "Succesfully get data from the server",
};

exports.create = async (req, res) => {
    const { no_kelompok, lokasi, proker } = req.body;

    try {
        const kelompok = new Kelompok({
            no_kelompok,
            lokasi,
            proker,
        });

        const insertKelompok = await kelompok.save();
        if (!insertKelompok)
            jsonResponse.error(req, res, message.error_create, 400);

        // const user = new User({
        //     user: no_kelompok,
        //     kelompok: kelompok._id,
        // });

        // const createUser = await user.save();
        // if (!createUser)
        //     jsonResponse.error(
        //         req,
        //         res,
        //         "failed to create user for login Kelompok",
        //         400
        //     );

        jsonResponse.success(req, res, message.success_create, {
            kelompok: insertKelompok,
        });
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400, []);
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        const kelompok = await Kelompok.findById(id)
            .select("-__v")
            .populate("proker")
            .populate("laporan")
            .populate("profilDesa");

        if (!kelompok) jsonResponse.error(req, res, message.error_get, 400, []);

        const response = { kelompok: kelompok };
        jsonResponse.success(req, res, message.success_get, response);
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400, []);
    }
};

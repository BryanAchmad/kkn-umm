const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const Mahasiswa = db.mahasiswa;
const Kelompok = db.kelompok;
const User = db.user;
const jsonResponse = require("../libs/jsonResponse");
require("dotenv").config();

exports.login = async (req, res) => {
    try {
        const { nim, pic } = req.body;
        console.log(typeof nim, typeof pic);
        // const picString = toString(pic);
        // console.log("nim ", nim, " ,pic ", typeof pic);

        const user = await User.findOne({ nim: req.body.nim });
        console.log(user);
        if (!user) {
            return res
                .status(400)
                .send({ message: "Cant find user with that NIM" });
        }
        // console.log(user.idMahasiswa.pic);
        // console.log(typeof user.pic);

        // const mahasiswa = await Mahasiswa.findOne({ nim });
        const encrypt = await bcrypt.compare(pic, user.idMahasiswa.pic);
        if (!encrypt) {
            return res.status(400).send({ message: "PIC salah" });
        }

        const token = jwt.sign(
            { user_id: user._id, nim },
            process.env.TOKEN_KEY,
            {
                expiresIn: "1d",
            }
        );

        user.access_token = token;

        console.log("after token ", user);

        // const mahasiswa = JSON.parse(user);

        // delete mahasiswa.access_token;

        return res
            .status(200)
            .cookie("token-auth", token, { maxAge: 900000, httpOnly: true })
            .json({ success: true, message: "Login Success", data: user });
        // jsonResponse.success(req, res, "Login Success", user);
    } catch (error) {
        console.error(error);
    }
};

exports.register = async (req, res) => {
    try {
        const { nim, kelompok } = req.body;

        if (!(nim, kelompok)) {
            return res.status(400).send({ message: "All input is required" });
        }
        const mahasiswa = await Mahasiswa.findOne({ nim: nim });
        if (!mahasiswa) {
            return res.status(400).send({
                message: "mahasiswa dengan nim tersebut tidak ditemukan",
            });
        }

        const checkKelompok = await Kelompok.findOne({ no_kelompok: kelompok });
        if (!checkKelompok) {
            return res.status(400).send({
                message: `Kelompok ${kelompok} tidak ditemukan`,
            });
        }

        // const checkUser = await User.findOne({ nim });
        const checkUser = await User.find({
            nim: nim,
            "kelompok.no_kelompok": kelompok,
        })
            .populate("mahasiswa")
            .populate("kelompok");
        if (!checkUser) {
            return res.status(409).send({
                message: "User already exist. Please login",
            });
        }

        const user = new User({
            nim: mahasiswa.nim,
            idMahasiswa: mahasiswa._id,
            kelompok: checkKelompok._id,
        });

        const saveUser = await user.save();
        if (!saveUser) {
            return res.status(400).send({ message: "Failed to create user" });
        }

        jsonResponse.success(
            req,
            res,
            `Success to add new user for Kelompok ${kelompok}`,
            saveUser
        );
    } catch (error) {
        jsonResponse.error(req, res, error.message, 400);
    }
};

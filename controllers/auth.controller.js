const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const Mahasiswa = db.mahasiswa;
const Kelompok = db.kelompok;
const jsonResponse = require("../libs/jsonResponse");

exports.login = async (req, res) => {
    try {
        const { nim, pic } = req.body;

        if (!(nim && pic)) {
            res.status(400).send({ message: "All input is required" });
            return;
        }

        const mahasiswa = await Mahasiswa.findOne({ nim });
        const encrypt = await bcrypt.compare(pic, mahasiswa.pic);
        if (!mahasiswa || !encrypt) {
            jsonResponse.error(req, res, "data not found", 400);
        }

        const token = jwt.sign(
            { mahasiswa_id: mahasiswa._id, nim },
            process.env.TOKEN_KEY,
            {
                expiresIn: "1d",
            }
        );

        mahasiswa.access_token = token;

        const kelompok = await Kelompok.findOne({
            kelompok: mahasiswa.kelompok,
        });
        console.log(kelompok)

        // if (mahasiswa && (await bcrypt.compare(pic, mahasiswa.pic))) {
        //     const token = jwt.sign(
        //         { mahasiswa_id: mahasiswa._id, nim },
        //         process.env.TOKEN_KEY,
        //         {
        //             expiresIn: "1d",
        //         }
        //     );

        //     mahasiswa.access_token = token;

        //     return res.status(200).json(mahasiswa)
        // }

        // res.status(400).send({ message: "Invalid credentials" });
    } catch (error) {
        console.error(error);
    }
};

exports.register = async (req, res) => {
    try {
        const { nama, email, password } = req.body;

        if (!(nama, email, password)) {
            res.status(400).send({ message: "All input is required" });
            return;
        }

        const checkUser = await User.findOne({ email });
        if (checkUser) {
            res.status(409).send({
                message: "User already exist. Please login",
            });
            return;
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            nama,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        user.token = token;

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
    }
};

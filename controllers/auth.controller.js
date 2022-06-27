const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!(email && password)) {
            res.status(400).send({ message: "All input is required" })
            return;
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user.id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;

            res.status(200).json(user);
            return;
        }
        res.status(400).send({ message: "Invalid credentials"});
    } catch (error) {
        console.error(error);
    }
}

exports.register = async (req, res) => {
    try {
        const { nama, email, password } = req.body;

        if(!(nama, email, password)) {
            res.status(400).send({ message: "All input is required"})
            return;
        }

        const checkUser = await User.findOne({ email });
        if(checkUser) {
            res.status(409).send({ message: "User already exist. Please login"})
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
}
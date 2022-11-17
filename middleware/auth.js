const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

const config = process.env;

const verifyToken = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        res.status(403).send({
            message: "A token is required for authentication",
        });
        return;
    }

    try {
        const decode = jwt.verify(token, config.TOKEN_KEY);
        const user = await User.findByid(decode.id);
        if (!user) {
            res.status(404).send({ message: "No user found with this id" });
        }
        console.log(decode);
        console.log(req.user);
        req.user = user;
    } catch (error) {
        res.status(401).send({ message: "Invalid Token" });
        return;
    }

    next();
};

module.exports = verifyToken;

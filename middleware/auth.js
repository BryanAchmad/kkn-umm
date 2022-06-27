const jwt = require("jsonwebtoken")

const config = process.env;

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        res.status(403).send({ message: "A token is required for authentication" })
        return;
    }

    try {
        const decode = jwt.verify(token, config.TOKEN_KEY);
        console.log(decode);
        console.log(req.user);
        req.user = decode;
    } catch (error) {
        res.status(401).send({ message: "Invalid Token" })
        return;
    }

    next();
};

module.exports = verifyToken;
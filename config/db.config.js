// const mongoose = require("mongoose");
require("dotenv").config();
// const { MONGO_URI } = process.env;
const db = require("../models");
const dbCredentials = {
    HOST: "mongodb://127.0.0.1:27017",
    DB: "skripsi_kkn",
};

exports.connect = () => {
    // db.mongoose.connect(`${dbCredentials.HOST}/${dbCredentials.DB}`, {
    db.mongoose
        .connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Successfully connect to the database");
        })
        .catch((error) => {
            console.log("Database connection failed");
            console.error(error);
            process.exit(1);
        });
};

// const mongoose = require("mongoose");
const { MONGO_URI } = process.env;
const db = require("../models");
const dbCredentials = {
    HOST: "mongodb://localhost:27017",
    DB: "skripsi_kkn"
}

exports.connect = () => {
    db.mongoose.connect(`${dbCredentials.HOST}/${dbCredentials.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to the database")
    })
    .catch((error) => {
        console.log("Database connection failed");
        console.error(error)
        process.exit(1);
    });
}
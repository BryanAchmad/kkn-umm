const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.user = require("./user.model");
db.proker = require("./proker.model");
db.kelompok = require("./kelompok.model")


module.exports = db;
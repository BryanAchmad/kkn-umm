const util = require("util");
const multer = require("multer");
// const dbConfig = require("../config/db.config")
// const { GridFsStorage } = require("multer-gridfs-storage");

// const db = require("../config/db.config");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/laporan");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadPdf = multer({ storage: storage, fileFilter: fileFilter });

module.exports = { uploadPdf };

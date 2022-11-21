require("dotenv").config();
require("./config/db.config").connect();
const express = require("express");
require("express-group-routes");
const app = express();
const path = require("path");

const cors = require("cors");
var corsOptions = {
    origin: ["http://localhost:3000", "https://pwa-kkn-fe.vercel.app"],
};

const authController = require("./controllers/auth.controller");
const prokerController = require("./controllers/proker.controller");
const kelompokController = require("./controllers/kelompok.controller");
const kegiatanController = require("./controllers/kegiatan.controller");
const divisiController = require("./controllers/divisi.controller");
const mahasiswaController = require("./controllers/mahasiswa.controller");
const laporanController = require("./controllers/laporan.controller");
const profilDesaController = require("./controllers/profilDesa.controller");
const mediaController = require("./controllers/media.controller");
const auth = require("./middleware/auth");
const { upload } = require("./middleware/upload");
const { uploadPdf } = require("./middleware/uploadPdf");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(function (req, res, next) {
    // res.header("Access-Control-Allow-Origin", "http://192.168.1.10:3000/");
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads/")));
// app.use("/laporan", express.static(path.join(__dirname, "laporan")));

// app.use("/api");

app.get("/", (req, res) => {
    res.send({ message: "Halooor" });
    console.log("Hallooo");
});

app.post("/register", authController.register);
app.post("/login", authController.login);

// app.group("/api/v1", (router) => {
//     app.use(auth);
//     app.post("/welcome", (req, res) => {
//         res.status(200).send("Welcome ❤");
//     });
//     app.post("/proker/create", prokerController.create);
// })

app.post("/welcome", (req, res) => {
    res.status(200).send("Welcome ❤");
});

/**
 * kelompok route
 */
app.post("/kelompok/create", kelompokController.create);
app.get("/kelompok/:id", kelompokController.getById);

/**
 * proker route
 */
app.post("/proker/:id", prokerController.create); //upsert kelompok.proker using id kelompok
app.get("/proker/:id", prokerController.fetchAll); //id kelompok
app.get("/proker/details/:id", prokerController.fetchOne); //id proker
app.patch("/proker/:id", prokerController.update); //id proker
app.delete("/proker/:id", prokerController.delete); // id proker
// app.get("/proker/:id", prokerController.fetch) //find by id kelompok

/**
 * kegiatan route
 */
app.post(
    "/kegiatan/:id",
    upload.array("images"),
    kegiatanController.uploadFile
);
app.get("/kegiatan/:idProker", kegiatanController.getByKelompok);

/**
 * divisi route
 */
app.post("/divisi", divisiController.create);
app.get("/divisi", divisiController.get);

/**
 * mahasiswa route
 */
app.post("/mahasiswa", mahasiswaController.create);
app.get("/mahasiswa/:kelompok", mahasiswaController.getByKelompok);
// console.log("error");
// app.get("/proker/detail/:id", prokerController.findOne);
// app.put("/proker/detail/:id", prokerController.update);

/**
 * laporan
 */
app.post("/laporan/:id", uploadPdf.single("file"), laporanController.create);
app.get("/laporan/:id", laporanController.getById);
app.get("/laporan/all/:idKelompok", laporanController.fetchAll);

app.post(
    "/profil-desa/:id",
    uploadPdf.single("file"),
    profilDesaController.create
);

app.post("/media/:id", mediaController.create);
app.delete("/media/:idLaporan/:idMedia", mediaController.delete);
app.get("/media/:kelompok", mediaController.getByKelompok);

const PORT = process.env.PORT || 8080;
console.log(PORT);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

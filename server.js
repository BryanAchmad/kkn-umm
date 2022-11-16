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

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome ❤");
});

/**
 * kelompok route
 */
app.post("/kelompok/create", kelompokController.create);
app.get("/kelompok/:id", auth, kelompokController.getById);

/**
 * proker route
 */
app.post("/proker/:id", auth, prokerController.create); //upsert kelompok.proker using id kelompok
app.get("/proker/:id", auth, prokerController.fetchAll); //id kelompok
app.get("/proker/details/:id", auth, prokerController.fetchOne); //id proker
app.patch("/proker/:id", auth, prokerController.update); //id proker
app.delete("/proker/:id", auth, prokerController.delete); // id proker
// app.get("/proker/:id", prokerController.fetch) //find by id kelompok

/**
 * kegiatan route
 */
app.post(
    "/kegiatan/:id",
    auth,
    upload.array("images"),
    kegiatanController.uploadFile
);
app.get("/kegiatan/:idProker", auth, kegiatanController.getByKelompok);

/**
 * divisi route
 */
app.post("/divisi", auth, divisiController.create);
app.get("/divisi", auth, divisiController.get);

/**
 * mahasiswa route
 */
app.post("/mahasiswa", mahasiswaController.create);
app.get("/mahasiswa/:kelompok", auth, mahasiswaController.getByKelompok);
// console.log("error");
// app.get("/proker/detail/:id", auth, prokerController.findOne);
// app.put("/proker/detail/:id", auth, prokerController.update);

/**
 * laporan
 */
app.post(
    "/laporan/:id",
    auth,
    uploadPdf.single("file"),
    laporanController.create
);
app.get("/laporan/:id", auth, laporanController.getById);
app.get("/laporan/all/:idKelompok", auth, laporanController.fetchAll);

app.post(
    "/profil-desa/:id",
    auth,
    uploadPdf.single("file"),
    profilDesaController.create
);

app.post("/media/:id", auth, mediaController.create);
app.delete("/media/:idLaporan/:idMedia", auth, mediaController.delete);

const PORT = process.env.PORT || 8080;
console.log(PORT);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

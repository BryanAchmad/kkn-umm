require("dotenv").config();
require("./config/db.config").connect();
const express = require("express");
require("express-group-routes");
const app = express();

const cors = require("cors");
var corsOptions = {
    origin: 'http://localhost:8081'
};

const authController = require("./controllers/auth.controller");
const prokerController = require("./controllers/proker.controller");
const kelompokController = require("./controllers/kelompok.controller");
const kegiatanController = require("./controllers/kegiatan.controller")
const auth = require("./middleware/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors(corsOptions));
app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

app.get('/', (req, res) => {
    res.send({ message: "Halooor"})
    console.log("Hallooo")
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

app.post("/welcome",auth, (req, res) => {
    res.status(200).send("Welcome ❤");
}); 

/**
 * kelompok route
 */
app.post("/kelompok/create", kelompokController.create);
app.get("/kelompok/:id", kelompokController.findKelompokById);

/**
 * proker route
 */
app.post("/proker/:id", prokerController.create) //upsert kelompok.proker using id kelompok
app.get("/proker/:id", prokerController.fetchAll) //id kelompok
app.patch("/proker/:id", prokerController.update) //id proker
app.delete("/proker/:id", prokerController.delete) // id proker
// app.get("/proker/:id", prokerController.fetch) //find by id kelompok

/**
 * kegiatan route
 */
app.post("/kegiatan/:id", kegiatanController.create)
app.get("/kegiatan/:idProker", kegiatanController.getByKelompok)

// console.log("error");
// app.get("/proker/detail/:id", auth, prokerController.findOne);
// app.put("/proker/detail/:id", auth, prokerController.update);

const PORT = process.env.PORT || 8080;
console.log(PORT);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});



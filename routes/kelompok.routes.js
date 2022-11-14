const router = require("express").Router();
const kelompokController = require("../controllers/kelompok.controller")

router.post("/kelompok/create", kelompokController.create);
router.get("/kelompok/:id", kelompokController.getById);

module.exports = router;

const mongoose = require("mongoose");
const db = require("../models");
const Proker = db.proker;
const Kelompok = db.kelompok;

exports.create = async (req, res) => {
    const { id } = req.params;
    const { title, divisi, deskripsi } = req.body

    try {
        const proker = new Proker({
            title,
            divisi,
            deskripsi,
        });

        const saveProker = await proker.save();
        const saveToKelompok = await Kelompok.findByIdAndUpdate(
            id,
            { $push: { proker: saveProker._id } },
            { new: true, useFindAndModify: false }
        )

        res.status(200).json(saveToKelompok)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
};

exports.index = async (req, res) => {
  await Proker.find()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
};

// exports.findByKelompok = async (req, res) => {
//   const kelompok = req.params.kelompok;
//   await Proker.find({ kelompok: kelompok })
//     .exec()
//     .then((data) => {
//       console.log(data);
//       res.json(data);
//     })
//     .catch((error) => {
//       res.status(500).send({ message: error });
//     });
// };

exports.findOne = async (req, res) => {
  const id = req.params.id;
  await Proker.findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Not found" });
      } else {
        res.status(200).send({ message: "Success", data: data });
      }
    })
    .catch((error) => {
      res.status(500).send({ message: "failed", error: error });
    });
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  await Proker.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res
          .status(400)
          .send({ message: `Proker dengan id = ${id} tidak ditemukan` });
      } else {
        res.status(200).send({ message: "Berhasil menghapus proker" });
      }
    })
    .catch((error) => {
      res.status(500).send({ message: "something was wrong", error: error });
    });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const { title, divisi, deskripsi } = req.body;

  await Proker.findByIdAndUpdate(
    id,
    { title, divisi, deskripsi },
    { useFindAndModify: false }
  )
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "update failed" });
      } else {
        res.status(200).send({ message: "successfullu updated" });
      }
    })
    .catch((error) => {
      res.status(500).send({ message: "error happened", error: error });
    });
};

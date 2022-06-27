const db = require("../models");
const Kelompok = db.kelompok;
const Proker = db.proker;

exports.create = async (req, res) => {
    const { no_kelompok, lokasi, proker} = req.body

    const kelompok = new Kelompok({
        no_kelompok,
        lokasi,
        proker
    });

    try {
        const insertKelompok = await kelompok.save();
        res.status(200).json(insertKelompok); 
    } catch (error) {
        res.status(400).json({message: error.message});
    }

}

exports.updateProker = async (req, res) => {
    const { id } = req.params
    const { title, divisi, deskripsi } = req.body
    
    try{
        const proker = new Proker({
            title,
            divisi,
            deskripsi
        })
    
        const saveProker = await proker.save()
        console.log(saveProker);
        const saveToKelompok = await Kelompok.findByIdAndUpdate(
            id,
            { $push: { proker: saveProker._id } },
            { new: true, useFindAndModify: false }
        )
        console.log(saveToKelompok);

        res.status(200).json(saveToKelompok);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

exports.findKelompokById = async (req, res) => {
    try{
        console.log(req.params);
        const { id } = req.params
        const kelompok = await Kelompok.findById(id).populate("proker").exec();
        
        res.status(200).json(kelompok);
    }catch (error){
        res.status(400).json({message: error.message})
    }
}

exports.update = async (req, res) => {
    try {
        const { id } = req.params
        const { proker } = req.body

        const kelompok = await Kelompok.updateOne({_id: id}, {$set: proker})
        res.status(200).json(kelompok);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}
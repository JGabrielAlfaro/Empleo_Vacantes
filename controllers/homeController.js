const mongoose = require('mongoose')
const Vacante = mongoose.model('Vacante');

exports.mostrarTrabajos = async (req,res,next) => {

    const vacantes = await Vacante.find();
    //  console.log(vacantes);  
    if (!vacantes) return next();

    res.render('home',{
        nombrePagina: 'devJobs',
        tagline: 'Encuentra y Pública trabajos para desarrolladores Web',
        barra: true,
        boton: true,
        vacantes,
    })
}


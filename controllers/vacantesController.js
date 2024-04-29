
// const Vacante = require ('../models/Vacantes'); // Una forma de importar.

//Segunda forma de importar.
const mongoose = require ('mongoose');
const Vacante = mongoose.model('Vacante')

exports.formularioNuevaVacante = (req,res) => {
    res.render('nueva-vacante',{
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante'
    })
}


//Agrega las vacantes a la base de datos.
exports.agregarVacante = async (req,res) => {
    const vacante = new Vacante(req.body); // Se guarda en el modelo.

    //Crear arrelgo de habilidades (skills)
    vacante.skills = req.body.skills.split(',');

    // console.log(vacante);

    //Almacenarlo en base de datos.
    const nuevaVacante = await vacante.save();

    res.redirect(`/vacantes/${nuevaVacante.url}`)
}
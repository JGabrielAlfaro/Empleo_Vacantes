
// const Vacante = require ('../models/Vacantes'); // Una forma de importar.

//Segunda forma de importar.
const mongoose = require ('mongoose');
const Vacante = mongoose.model('Vacante')

exports.formularioNuevaVacante = (req,res) => {
    res.render('nueva-vacante',{
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre
    })
}

//Agrega las vacantes a la base de datos.
exports.agregarVacante = async (req,res) => {
    const vacante = new Vacante(req.body); // Se guarda en el modelo.

    //Usuario autor de la vacante.
    vacante.autor = req.user._id;

    //Crear arrelgo de habilidades (skills)
    vacante.skills = req.body.skills.split(',');

    // console.log(vacante);

    //Almacenarlo en base de datos.
    const nuevaVacante = await vacante.save();

    res.redirect(`/vacantes/${nuevaVacante.url}`)
}

//Mostrar Vacante
exports.mostrarVacante = async (req,res,next)=>{
    const vacante = await Vacante.findOne({url: req.params.url})

    //Si no hay resultado.
    if (!vacante) return next();

    res.render('vacante',{
        vacante,
        nombrePagina: vacante.titulo,
        barra: true,
    })
}

exports.formEditarVacante = async (req,res,next) => {
    const vacante = await Vacante.findOne({url: req.params.url})

    if(!vacante) return next();
    //  console.log(vacante)
    res.render('editar-vacante',{
        vacante,
        nombrePagina: `Editar - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre
    })
}

exports.editarVacante = async (req,res) => {
    const vacanteActualizada = req.body;
    vacanteActualizada.skills = req.body.skills.split(',');

    const vacante = await Vacante.findOneAndUpdate({url: req.params.url},vacanteActualizada,{
        new: true,
        runValidators:true,

    })
    res.redirect(`/vacantes/${vacante.url}`);
}

//Validar y sanitizar los campos de las nuevas vacantes.
exports.validarVacante = (req,res,next) => {
    //Sanitizar el campo skills.
    req.sanitizeBody('titulo').escape(); //Sanitizar el campo titulo.
    req.sanitizeBody('empresa').escape(); //Sanitizar el campo empresa.
    req.sanitizeBody('ubicacion').escape(); //Sanitizar el campo ubicacion.
    req.sanitizeBody('salario').escape(); //Sanitizar el campo salario.
    req.sanitizeBody('contrato').escape(); //Sanitizar el campo contrato.
    req.sanitizeBody('skills').escape(); //Sanitizar el campo skills.

    //Validar
    req.checkBody('titulo','Agrega un titulo a la vacante').notEmpty();
    req.checkBody('empresa','Agrega una empresa').notEmpty();
    req.checkBody('ubicacion','Agrega una ubicacion').notEmpty();
    req.checkBody('contrato','Agrega un contrato').notEmpty();
    req.checkBody('skills','Agrega al menos una habilidad').notEmpty();

    const errores = req.validationErrors();
    if(errores){
        //si hay errores    
        req.flash('error',errores.map(error => error.msg ));
        res.render('nueva-vacante',{
            nombrePagina: 'Nueva Vacante',
            tagline: 'Llena el formulario y publica tu vacante',
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        })
    }
    next(); //Si hay errores no se ejecuta el Middleware.
}
const passport = require('passport');
const mongoose = require ('mongoose');
const Vacante = mongoose.model('Vacante');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

//Revisar si el usuario esta autenticado o no.
exports.verificarUsuario = (req,res,next) => {

    //revisar el usuario
    if(req.isAuthenticated()){
        return next(); //esta autenticado
    }
    //redireccionar
    res.redirect('/iniciar-sesion')
}

exports.mostrarPanel = async (req,res) => {

    //Consultar el usuario autenticado
    const vacantes = await Vacante.find({autor:req.user._id});
    res.render('administracion',{
        nombrePagina: "Panel de Administración",
        tagline: 'Crea y Administra tus vacantes desde aquí',
        vacantes
    })
}
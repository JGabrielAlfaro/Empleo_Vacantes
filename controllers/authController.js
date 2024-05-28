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
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        vacantes
    })
}

//Cerrar Sesion
exports.cerrarSesion = (req,res,next) => {
    //Forma 1:
    //req.flash('correcto', 'Sesion Cerrada Correctamente')
    req.session.destroy(()=>{
       return res.redirect('/iniciar-sesion') //al cerrar la sesion redireccionamos al formulario de inicio de sesion
    })
    



    //Forma 2:
    // req.logout((err) => {
    //     if (err) {
    //         // Si hay un error al cerrar sesión, pasar al siguiente middleware con el error
    //         return next(err);
    //     }
    //     // Redirigir al usuario a la página de inicio de sesión
    //     res.redirect('/iniciar-sesion');
    // });
}
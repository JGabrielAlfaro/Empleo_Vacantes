const mongoose = require ('mongoose');
const Usuarios = mongoose.model('Usuarios');

exports.formCrearCuenta = (req,res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu Cuenta en DevJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
}


exports.crearUsuario = async (req,res,next) => {

    //Crear usuario
    const usuario = new Usuarios(req.body)
    // console.log(usuario)
    // const nuevoUsuario = await usuario.save();

    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
     // 'error' es una clase de css.
       req.flash('error',error);
       res.redirect('/crear-cuenta');
    }

}

exports.validaRegistro = async (req, res, next) => {

    //Sanitizar por seguridad
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirmar').escape();

    //Validar
    req.checkBody('nombre', "El nombre es Obligatorio").notEmpty();
    req.checkBody('email', "El e-mail debe ser valido").isEmail();
    req.checkBody('password', "La contraseña no puede ir vacia").notEmpty();
    req.checkBody('confirmar', "La confirmación del password no puede estar vacia").notEmpty();
    req.checkBody('confirmar', "El password es diferente").equals(req.body.password);

    const errores = req.validationErrors()

    //  console.log(errores)
    if(errores){
        //si hay errores
        req.flash('error',errores.map(error => error.msg ));

        res.render('crear-cuenta',{
            nombrePagina: 'Crea tu Cuenta en DevJobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes: req.flash(),
        })
        return;
    }

    //Si toda la validación es correcta
    next();
    return;
};


//Formulario para iniciar sesion
exports.formIniciarSesion = async(req,res) => {

    res.render('iniciar-sesion',{
        nombrePagina: 'Iniciar Sesión DebJobs'
    })
}
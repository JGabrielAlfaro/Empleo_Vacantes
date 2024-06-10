const passport = require('passport');
const mongoose = require ('mongoose');
const Vacante = mongoose.model('Vacante');
const Usuario = mongoose.model('Usuarios');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

//Valida si el token es valido y el usuario es valido, muestra la vista.
exports.restablecerPassword = async (req,res) => {
    // console.log(req.params.token)
    const usuario = await Usuario.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    });

    if(!usuario){   
        req.flash('error','El token es invalido o ha expirado');
        res.redirect('/restablecer-password');
    }

    //Todo bien, mostrar el formulario
    res.render('nuevo-password', {
        nombrePagina: 'Nueva Password',   
    })
}

//Almacena el nuevo password en la base de datos.
exports.guardarPassword = async (req,res) => {

    const usuario = await Usuario.findOne({
        token: req.params.token,    
        expira: {
            $gt: Date.now()
        }
    });

    if(!usuario){
        req.flash('error','El token es invalido o ha expirado');
        res.redirect('/restablecer-password');
    }


    //Asignar el nuevo password
    usuario.password = req.body.password;
    usuario.expira= undefined; //Limpiamos los valores previos
    usuario.token = undefined;  //Limpiamos los valores previos
    await usuario.save();

    req.flash('correcto', 'Password modificado correctamente')
    res.redirect('/iniciar-sesion');
}
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

//Formulario para reiniciar el password
exports.formReestablecerPassword = (req,res) => {
    res.render('restablecerPassword',{
        nombrePagina: 'Restablece tu Password',
        tagline: 'Si ya tienes una cuenta pero olvidadeste tu password, coloca tu email'
    })
}

//Generar el token en la tabla del usuario
exports.enviarToken = async (req,res) => {
    const usuario  = await Usuario.findOne({email: req.body.email});

    if(!usuario){
        req.flash('error','No existe esa cuenta')
        return res.redirect('/iniciar-sesion')
    }

    //El usuario existe, agregamos el token y expiracion al modelo.
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000;

    //Guardamos el usuario
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/restablecer-password/${usuario.token}`;
    // console.log(resetUrl)

    //TODO: Enviar el email
    await enviarEmail.enviar({
        usuario,
        subject: 'Restablece tu Password',
        resetUrl,
        archivo: 'reset'
    })

    //Todo correcto
    req.flash('correcto', 'Hemos enviado un email con las instrucciones')
    res.redirect('/iniciar-sesion')
}

const mongoose = require ('mongoose');
const Usuarios = mongoose.model('Usuarios');
const multer = require('multer');
const shortid = require('shortid');


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

// Form Editar el perfil

exports.formEditarPerfil = (req,res) => {
    res.render('editar-perfil',{
        nombrePagina: "Edita tu Perfil en DevJobs",
        usuario: req.user,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    })
}

// Guardar cambios editar Perfil
exports.editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findById(req.user._id);
    
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;


    if(req.body.password){
        usuario.password = req.body.password
    }


    if(req.file){
        usuario.imagen = req.file.filename;
    }

    await usuario.save();

    req.flash('correcto', "Se guardaron los cambios correctamente")

    //Redirigimos al usuario si todo salio bien
    res.redirect('/administracion');
}

//Sanitizar y validar el formulario de editar perfil.
exports.validarPerfil = (req,res,next) => {

    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();

    if(req.body.password){
        req.sanitizeBody('password').escape();
    }

    req.checkBody('nombre', "El nombre es Obligatorio").notEmpty();
    req.checkBody('email', "El e-mail debe ser valido").isEmail();


    //Validar errores
    const errores = req.validationErrors()
    if(errores){
        //si hay errores    
        req.flash('error',errores.map(error => error.msg ));
        res.render('editar-perfil',{
            nombrePagina: "Edita tu Perfil en DevJobs",
            usuario: req.user,
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash(),
            imagen: req.user.imagen
        })
    }
    next(); //Si hay errores no se ejecuta el Middleware.

}


//CONFIGURACION DEL PERFIL, SUBIR IMAGEN
exports.subirImagen = (req,res,next) => {
    upload(req,res,function(error){
        // console.log(error)
        if(error){
            if(error instanceof multer.MulterError){
               if(erro.code === 'LIMIT_FILE_SIZE'){
                   req.flash('error','El archivo es demasiado grande: Maximo 100kb' );
               }else {
                    req.flash('error', error.message);
               }
            }else {
                req.flash('error', error.message);
            }
            res.redirect('/administracion');
            return;
        }else {
            return next();
        }
    })
}
const configuracionMulter = {
    limits: { fileSize: 1000000 },
    storage:fileStorage = multer.diskStorage({
        destination:(req,file,cb) => {
            cb(null,__dirname + '/../public/uploads/perfiles')
        },
        filename: (req,file,cb) => {
           const extesion = file.mimetype.split('/')[1];
        //    console.log(`${shortid.generate()}.${extesion}`);
           cb(null,`${shortid.generate()}.${extesion}`);
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            cb(null,true);
        }else{
            cb(new Error('Formato no Valido'),false);
        }
    },
   
}

const upload  = multer(configuracionMulter).single('imagen');
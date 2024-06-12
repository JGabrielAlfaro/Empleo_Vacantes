
// const Vacante = require ('../models/Vacantes'); // Una forma de importar.

//Segunda forma de importar.
const mongoose = require ('mongoose');
const Vacante = mongoose.model('Vacante')
const multer = require('multer');
const shortid = require('shortid');

exports.formularioNuevaVacante = (req,res) => {
    res.render('nueva-vacante',{
        nombrePagina: 'Nueva Vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
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
    const vacante = await Vacante.findOne({url: req.params.url}).populate('autor')

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
        nombre: req.user.nombre,
        imagen: req.user.imagen
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

exports.eliminarVacante = async (req,res) => {
    const {id} = req.params;

    const vacante = await Vacante.findById(id);

    if(verificarAutor(vacante, req.user)){
        await vacante.deleteOne();
        res.status(200).send('Vacante eliminada');
    }else {
        res.status(403).send('Error');
    }
    
    
}

const verificarAutor = async (vacante = {}, usuario = {}) => {
  if (!vacante.autor.equals(usuario._id)) {
    return false;
  }
  return true;
};
//Almacenar los candidatos en la base de datos
exports.contactar = async (req,res,next) => {
   
    const vacante = await Vacante.findOne({url: req.params.url});
    if(!vacante) return next();

    //Construimos el objeto nuevoCandidato
    const nuevoCandidato = {
        nombre: req.body.nombre,
        email: req.body.email,
        cv: req.file.filename
    }
    //Almacenar la vacante.
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();

    //Mensaje flash y redireccionar
    req.flash('correcto', 'Se envio correctamente tu CV');
    res.redirect('/');

}
//Subir archivo en pdf

exports.subirCV =  (req,res,next) => {
    upload(req,res,function(error){
        // console.log(error)
        if(error){
            if(error instanceof multer.MulterError){
               if(error.code === 'LIMIT_FILE_SIZE'){
                   req.flash('error','El archivo es demasiado grande: Maximo 100kb' );
               }else {
                    req.flash('error', error.message);
               }
            }else {
                req.flash('error', error.message);
            }
            res.redirect('back');
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
            cb(null,__dirname + '/../public/uploads/cv')
        },
        filename: (req,file,cb) => {
           const extesion = file.mimetype.split('/')[1];
        //    console.log(`${shortid.generate()}.${extesion}`);
           cb(null,`${shortid.generate()}.${extesion}`);
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype === 'application/pdf'){
            cb(null,true);
        }else{
            cb(new Error('Formato no Valido'),false);
        }
    },
   
}

const upload  = multer(configuracionMulter).single('cv');


//Mostrar la vacante
exports.mostrarCandidatos = async (req,res,next) => {
  console.log(req.params.id)
  const vacante = await Vacante.findById(req.params.id);
  if(vacante.autor.toString() !== req.user._id.toString()){
    return next(); 
  }
  if(!vacante) return next();

  res.render('candidatos', {
    nombrePagina: `Candidatos Vacante- ${vacante.titulo}`,
    cerrarSesion: true,
    nombre: req.user.nombre,
    imagen: req.user.imagen,
    candidatos: vacante.candidatos
  })
}

//Buscado de vacacantes
exports.buscarVacantes = async (req,res) => {

    const vacantes = await Vacante.find({
        $text: {
            $search: req.body.q
        }
    }).lean(); //Agregar!    

    //mostrar la vacante
    res.render('home', {
        nombrePagina: `Resultados para la busqueda: ${req.body.q}`,
        barra: true,
        vacantes
    })
     

}
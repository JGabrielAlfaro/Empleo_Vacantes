const mongoose = require ('mongoose');
mongoose.Promise = global.Promise;

const slug = require('slug');
const shortid = require('shortid');

const vacantesSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: 'El nombre de la vacacnte es obligatorio',
        trim: true,
    },
    empresa: {
        type: String,
        trim: true,
    },
    ubicacion: {
        type: String,
        trim: true,
        required: 'La ubicaciones es obligatoria'
    },
    salario : {
        type: String,
        default: 0,
    },
    contrato: {
        type: String,
        trim: true,
    },
    descripcion: {
        type:String,
        trim: true,
    },
    url: {
        type: String,
        lowercase: true,
    },
    skills: [String],
    candidatos: [{
        nombre:String,
        email: String,
        cv: String,
    }]
})

//Configurando un middleware antes de guardar.
vacantesSchema.pre('save',function(next){
   //Crear la URL
   const url = slug(this.titulo);
   this.url = `${url}-${shortid.generate()}`
   next();
})

module.exports = mongoose.model('Vacante',vacantesSchema);
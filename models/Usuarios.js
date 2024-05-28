const mongoose = require ('mongoose');
mongoose.Promise = global.Promise;

const bcrypt = require('bcrypt');

const usuarioSCHEMA = new mongoose.Schema({
    email: {
        type:String,
        unique: true,
        lowercase:true,
        trim: true,

    },
    nombre: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    token: String,
    expira: Date,
    imagen: String,
})

// Método para hashear los password.
usuarioSCHEMA.pre('save',async function(next){
    //Si el password ya esta hasheado no hacemos nada.
    if(!this.isModified('password')){
        return next(); //deten la ejecucion
    }

    //Sino esta hasheado
    const hash = await bcrypt.hash(this.password,12)
    this.password = hash;
    next();

});

//Envía alerta cuando un usuario se encuentra registrado.
usuarioSCHEMA.post('save',function(error, doc, next){
    // console.log(error.name)
    if(error.name === "MongoServerError" && error.code === 11000){
        next('Ese correo ya esta registrado');
    }else {
        // console.log(error)
        next(error);
    }
})

//Autenticar usuarios.
usuarioSCHEMA.methods = {
    comparaPassword: function(password){
        return bcrypt.compareSync(password, this.password)
    }
}
module.exports = mongoose.model('Usuarios',usuarioSCHEMA)
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async(email, password, done) => {
    try {
        // Buscar el usuario por su email
        const usuario = await Usuarios.findOne({ email });

        // Si no se encuentra el usuario, devolver un mensaje de error
        if (!usuario) {
            return done(null, false, { message: 'Usuario no existe' });
        }

        // Verificar si la contraseña es correcta
        const contraseñaValida = await bcrypt.compare(password, usuario.password);

        // Si la contraseña es incorrecta, devolver un mensaje de error
        if (!contraseñaValida) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        // Si el usuario y la contraseña son válidos, devolver el usuario autenticado
        return done(null, usuario);

    } catch (error) {
        // Si ocurre un error, devolver el error
        return done(error);
    }
}));

passport.serializeUser((usuario,done)=> done(null,usuario._id))

passport.deserializeUser(async (id,done) => {
    const usuario = await Usuarios.findById(id).exec();
    return done(null, usuario)
})

module.exports = passport;
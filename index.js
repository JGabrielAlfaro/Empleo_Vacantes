const mongoose = require('mongoose');

// Llama al archivo de configuración de la base de datos para establecer la conexión
require('./config/db')();

const bodyParser = require('body-parser'); // Habilitamos bodyParser
const express = require('express'); // Importar express.
const app = express();
const router = require('./routes'); // Integración con router.

// Importar la vista con express-handlebars.
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

const path = require('path'); // Importamos path para obtener la URL de elementos

//Validaciones
const expressValidator = require('express-validator');
const flash = require('connect-flash'); //Manejo de errores.
const createError = require('http-errors');//Manejo de errores. Otra tipo.

//Validaciones de password
const passport = require('./config/passport')


// Habilitamos body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Validacion de campos
 app.use( expressValidator() );

// Mantener una sesión.
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    mongoUrl: process.env.DATABASE,
    // Más opciones si es necesario
});

require('dotenv').config({ path: '.env' });

// Habilitar handlebars como vista debe estar en views/layouts
app.engine('handlebars', exphbs.engine({
    handlebars: allowInsecurePrototypeAccess(handlebars),
    defaultLayout: 'layout',
    helpers: require('./helpers/handlebars')
}));

app.set('view engine', 'handlebars');

// Leer archivos estáticos en el directorio public.
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(
    session({
        secret: process.env.SECRETO,
        key: process.env.KEY,
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

//Validacion de credenciales login
app.use(passport.initialize());
app.use(passport.session());

//Alertas y flash messages
app.use( flash() );

//Crear nuestro middleware
app.use((req,res,next) => {
    res.locals.mensajes = req.flash();
    next();
})

// Configuración del router
app.use('/', router());

// 404 Pagina no existente.
app.use(function (req, res, next) {
    next(createError(404,"No Encontrado"));
})

//Administracion de los errores.
app.use((error,req,res) => {
    // new Error('Un mensaje de error')
    res.locals.mensaje = error.message;
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status); //para que sepa el servidor que es un error.
    console.log(status);
    res.render('error');
})
app.listen(process.env.PUERTO);

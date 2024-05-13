const express = require('express');
const router = express();

//Importando controladores
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuarioController = require('../controllers/usuarioController');
const authController = require('../controllers/authController');

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos)

    //Crear vacacante
    router.get('/vacantes/nueva', authController.verificarUsuario, vacantesController.formularioNuevaVacante)
    router.post('/vacantes/nueva',authController.verificarUsuario, vacantesController.agregarVacante)

    //Mostrar vacante
    router.get('/vacantes/:url',vacantesController.mostrarVacante)

    //Editar vacante
    router.get('/vacantes/editar/:url',authController.verificarUsuario,vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url',authController.verificarUsuario,vacantesController.editarVacante);

    //Crear cuentas
    router.get('/crear-cuenta',usuarioController.formCrearCuenta);
    router.post('/crear-cuenta',usuarioController.validaRegistro,usuarioController.crearUsuario);

    //Autenticar usuario.
    router.get('/iniciar-sesion',usuarioController.formIniciarSesion);
    router.post('/iniciar-sesion',authController.autenticarUsuario);


    //Panel de administración
    router.get('/administracion',authController.verificarUsuario,authController.mostrarPanel);

    return router;
}
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
    router.post('/vacantes/nueva',authController.verificarUsuario,vacantesController.validarVacante, vacantesController.agregarVacante)

    //Mostrar vacante
    router.get('/vacantes/:url',vacantesController.mostrarVacante)

    //Editar vacante
    router.get('/vacantes/editar/:url',authController.verificarUsuario,vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url',authController.verificarUsuario,vacantesController.validarVacante,vacantesController.editarVacante);

    //Eliminar vacante
    router.delete('/vacantes/eliminar/:id',vacantesController.eliminarVacante);

    //Crear cuentas
    router.get('/crear-cuenta',usuarioController.formCrearCuenta);
    router.post('/crear-cuenta',usuarioController.validaRegistro,usuarioController.crearUsuario);


    //Autenticar usuario.
    router.get('/iniciar-sesion',usuarioController.formIniciarSesion);
    router.post('/iniciar-sesion',authController.autenticarUsuario);
    
    //Resetear Password (eamil)
    router.get('/restablecer-password',authController.formReestablecerPassword);
    router.post('/restablecer-password',authController.enviarToken);

    //Resetear password (almacenar en la bd)
    router.get('/restablecer-password/:token',authController.restablecerPassword);
    router.post('/restablecer-password/:token',authController.guardarPassword);



    //Cierre de sesión
    router.get('/cerrar-sesion',authController.verificarUsuario,authController.cerrarSesion);


    //Panel de administración
    router.get('/administracion',authController.verificarUsuario,authController.mostrarPanel);

    //Editar perfil
    router.get('/editar-perfil',authController.verificarUsuario,usuarioController.formEditarPerfil)
    router.post('/editar-perfil',
        authController.verificarUsuario,
        // usuarioController.validarPerfil,
        usuarioController.subirImagen,
        usuarioController.editarPerfil
    )

    //Recibir mensajes desde candidatos
    router.post('/vacantes/:url',
        vacantesController.subirCV,
        vacantesController.contactar
    );

    //Muestra los candidatos por vacante
    router.get('/candidatos/:id',
        authController.verificarUsuario,
        vacantesController.mostrarCandidatos
    )

    //Buscador de vacantes
    router.post('/buscador',vacantesController.buscarVacantes)

    return router;
}
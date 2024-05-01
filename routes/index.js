const express = require('express');
const router = express();

//Importando controladores
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos)

    //Crear vacacante
    router.get('/vacantes/nueva', vacantesController.formularioNuevaVacante)
    router.post('/vacantes/nueva', vacantesController.agregarVacante)

    //Mostrar vacante
    router.get('/vacantes/:url',vacantesController.mostrarVacante)

    //Editar vacante
    router.get('/vacantes/editar/:url',vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url',vacantesController.editarVacante);
    return router;
}
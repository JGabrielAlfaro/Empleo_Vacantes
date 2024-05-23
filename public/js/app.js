import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded',()=>{
    const skills = document.querySelector(".lista-conocimientos")

    //Limpiar las alertas
    let alertas = document.querySelector('.alertas');
    if (alertas) {
        limpiarAlertas();
    }
   
    if(skills){
        skills.addEventListener('click', agregarSkills)
    }

    const vacantesListado = document.querySelector(".panel-administracion");

    if(vacantesListado){
        vacantesListado.addEventListener('click',accionesListado)   
    }

})


const limpiarAlertas = () => {
    const alertas = document.querySelector('.alertas');

    const interval = setInterval(()=> {
        if (alertas.children.length>0){
            alertas.removeChild(alertas.children[0]);
        }else if(alertas.children.length ===0){
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    },2000)
}


const skills = new Set();

const agregarSkills = (e) => {
    // console.log(e.target);
    if(e.target.tagName === "LI"){

        if (e.target.classList.contains('activo')){
            //quitarlo del set y la clase.
            skills.delete(e.target.textContent);
             e.target.classList.remove('activo')

        }else {
            //Agregarlo al set y la clase.
            skills.add(e.target.textContent);
             e.target.classList.add('activo')
        }
        
    }

    // console.log(skills);
    const skillsArray = [...skills]; //Creamos una copia y lo convertimos un array.
    document.querySelector("#skills").value= skillsArray;

    //Una vez que estamos en editar llamar la funcion.
    skillSeleccionados();
}

const skillSeleccionados = () => {
    const seleccionadas = Array.from(document.querySelectorAll(".lista-conocimientos .activo"));
    // console.log(seleccionadas);

    seleccionadas.forEach (seleccionada => {
        skills.add(seleccionada.textContent)
    })
    //inyectamos en el hidden
    const skillsArray = [...skills]; //Creamos una copia y lo convertimos un array.
    document.querySelector("#skills").value= skillsArray;
}

//Eliminar vacaciones
const accionesListado = e => {
    e.preventDefault();


    if(e.target.dataset.eliminar){
        //Eliminar por axios

        Swal.fire({
            title: "Confirmar eliminación?",
            text: "Una vez eliminada no se puede recuperar!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Eliminar!",
            cancelButtonText: 'No, Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              // Enviar petición a axios
              const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`
              //axios para eliminar el registro
              axios.delete(url,{params: {url}}) 
                .then(function(respuesta){
                   if (respuesta.status === 200) {
                      Swal.fire({
                        title: "Eliminado!",
                        text: respuesta.data,
                        icon: "success"
                      });

                      //TODO: Eliminar del DOM
                      e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                   }
                })
                .catch(() => {
                    Swal.fire({
                        title: "Eliminado!",
                        text: 'No se pudo eliminar la vacante',
                        icon: "error"
                    })
                })

            }
          });
    }else if (e.target.tagName === "A") {
        window.location.href = e.target.href; // Me lleva a la ruta que es sino es el boton de eliminar.
    }
}
document.addEventListener('DOMContentLoaded',()=>{
    const skills = document.querySelector(".lista-conocimientos")
    if(skills){
        skills.addEventListener('click', agregarSkills)
    }

})

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


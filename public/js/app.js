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
}
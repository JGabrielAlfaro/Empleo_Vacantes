module.exports = {
    seleccionarSkills : (selecionadas=[],opciones) => {
        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress'];

        const seleccionadasTrimmed = selecionadas.map(skill => skill.trim());
        let html = '';
      
        skills.forEach(skill => {
            const trimmedSkill = skill.trim();
            html += `
                <li ${seleccionadasTrimmed.includes(trimmedSkill) ? ' class="activo"' : '' }> ${skill} </li>
            `;
        });
        //  console.log(html)
        return opciones.fn().html = html;
    },

    tipoContrato: (seleccionado,opciones) => {
       return opciones.fn(this).replace(
        new RegExp(`value="${seleccionado}"`), '$& selected="selected"'
       )
    }
}
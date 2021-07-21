import { validaInput } from './validacao.js'


const inputs = document.querySelectorAll('input');

inputs.forEach(input => {
    input.addEventListener('blur', (evento) =>{
        validaInput(evento.target);
    })
})




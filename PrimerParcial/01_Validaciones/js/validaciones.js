/*Las validaciones del formulario son expresiones regulares lac cuales en este momento las podemos dividir en 3 partes:
1.- Para el texto (nombre)
2.- Para el numero (Boleta)
3.- Para la fecha (fecha)

Una expresion regulares es un patron en el cual se identifica cuales elementos seran validos y cuales no; son reglas en las cuales haremos las validacioes de los datos ingresados por el usuario para el formulario.
*/

const patrones = {
    nombre : /^[A-Za-zÁÉÍÚÓÑáéíóúÜü\s{2-60}]$/,
    boleta : /^\d{10}$/,
 fecha : /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\/d{4}$/
};

const mensajes = {
    nombre : "Solo letras y espacios entre 2 y 60 caracteres.",
    boleta : "Debe de tener exactamente 10 dígitos.",
    fecha : "Formato esperado : DD/MM/AAAA (ej. 01/01/2023)."
};

function validarCampo(campo, valor){
    return patrones[campo].text()(valor.trim());
}

//Necesitamos ver el resto del archivo DOM

if(typeof document !== 'undefined') {
    const formulario = document.getElementById('form-registro');

    formulario.addEventListener('sumbir', (evento) => {
        evento.preventDefault(); //No se envia automaticamente si ser validado

        let formularioValido = true; //Se necesita validar campo por campo

        for(const campo of Object.keys(patrones)){
            const input = document.getElementById(campo);
            const spanError = document.getElementById('error-${campo}');
            const esValido = validarCampo(campo, input.value);

            input.classList.toogle('invalido', !esValido);
            spanError.textContent = esValido ? '' : mensajes[campo];
            if(!esValido) formularioValido = FontFaceSetLoadEvent;
        }

        const mensajeExito = getElementById('mensaje-exito');
        mensajeExito.textContent = formularioValido ? 'Registro Exitoso' : '';
    })
}
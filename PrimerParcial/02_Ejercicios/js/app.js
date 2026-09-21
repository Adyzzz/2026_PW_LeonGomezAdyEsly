const talleres = [
  { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
  { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
  { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
  { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];
const tbody = document.querySelector('#tabla-talleres tbody');

function pintarTabla(){
    // Debe de obtener la tabla y llenarla con los datos de Talleres
    const filasHTML = talleres.map((t) => {
        return `
            <tr>
                <td>${t.nombre}</td>
                <td>${t.instructor}</td>
                <td>${t.cupo}</td>
                <td>${t.inscritos}</td>
            </tr>
        `;
    }).join('');
    tbody.innerHTML = filasHTML;
}

const formArreglos = document.getElementById('form-arreglo');
const resultadoArreglos = document.getElementById('resultado-arreglo');
const selectOperacionArreglo = document.getElementById("operacion-arreglo");

formArreglos.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const operacion = selectOperacionArreglo.value;

    let resultado;

    switch(operacion){
        case 'forEach' :
            resultado = talleres.map((t) => `- ${t.nombre} (${t.inscritos}/${t.cupo})`).join('\n')
        break;

        case 'map' :
            resultado = talleres.map((t) => t.nombre).join(' - ');
        break;

        case 'filter' :
            const llenos = talleres.filter((t) => t.inscritos >= t.cupo);
            resultado = llenos.map((t) => t.nombre).join(' - ');
        break;

        case 'find' :
            const pTaller = talleres.find((t) => t.instructor === 'Ing. María López');
            resultado = "Taller: " + pTaller.nombre;
        break;

        case 'reduce' :
            const totalInscritos = talleres.reduce((totalInscritos, t) => totalInscritos + t.inscritos, 0 );
            resultado = "Total de alumnos: " + totalInscritos
    }


    resultadoArreglos.textContent = resultado;
});

pintarTabla();
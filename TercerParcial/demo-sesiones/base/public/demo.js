// La página solo hace fetch a la API. El navegador manda la cookie solo (misma página, mismo servidor).
const $ = (id) => document.getElementById(id);

// Esta funcion envia las peticiones fetch y devuelve una respuesta solo cuando el body existe/está y devuelve el estatus
async function llamar(metodo, url, cuerpo) {
  const opciones = { method: metodo, headers: {} };
  if (cuerpo) {
    opciones.headers['Content-Type'] = 'application/json';
    opciones.body = JSON.stringify(cuerpo);
  }
  const respuesta = await fetch(url, opciones);
  let datos = null;
  try { datos = await respuesta.json(); } catch { datos = null; }
  return { status: respuesta.status, datos };
}

// Como dice en la 2da linea, crea 'li', posterior a eso usa el textContent para el JSON y prepend() para poner lo nuevo hasta arriba
function anotar(metodo, url, status, datos) {
  const li = document.createElement('li');
  const clase = status < 300 ? 'ok' : status === 401 ? 'e401' : status === 403 ? 'e403' : 'error';
  li.innerHTML = `<span class="codigo ${clase}">${status}</span> <code>${metodo} ${url}</code>`;
  const cuerpo = document.createElement('pre');
  cuerpo.textContent = JSON.stringify(datos, null, 2);
  li.appendChild(cuerpo);
  $('bitacora').prepend(li);
}

// pinta el estado en verde o rojo consultando el metodo GET para /api/sesion, y mostrando el document.cookie en el #
async function refrescarEstado() {
  const { status, datos } = await llamar('GET', '/api/sesion');
  const estado = $('estado');
  if (status === 200) {
    estado.textContent = `${datos.usuario.nombre} · rol ${datos.usuario.rol} · sesión ${datos.sesion} · vence en ${datos.expiraEnSegundos} s`;
    estado.className = 'estado con-sesion';
  } else {
    estado.textContent = 'Sin sesión (el servidor responde 401)';
    estado.className = 'estado sin-sesion';
  }
  $('cookie-js').textContent = document.cookie || '(vacío)';
}


// Esta usa de nuevo el metodo get (linea 2) y limpia el <tbody>, ademas construye las filas de la tabla, en resumen, " refresca las sesiones "
async function refrescarSesiones() {
  const { datos: respuesta } = await llamar('GET', '/api/diagnostico/sesiones');
  const datos = respuesta ? respuesta.sesiones : [];
  if (respuesta) {
    $('donde').textContent = respuesta.almacen === 'memoria'
      ? 'En la MEMORIA del servidor: se borra al reiniciarlo.'
      : 'En MySQL, tabla sessions. En Workbench: SELECT * FROM demo_sesiones.sessions;';
  }
  const cuerpo = $('tabla-sesiones');
  cuerpo.innerHTML = '';
  if (!datos || datos.length === 0) {
    cuerpo.innerHTML = '<tr><td colspan="4">(sin sesiones)</td></tr>';
    return;
  }
  for (const s of datos) {
    const fila = document.createElement('tr');
    if (s.esLaTuya) fila.className = 'tuya';
    const vence = s.expira ? new Date(s.expira).toLocaleTimeString() : '—';
    for (const valor of [s.sesion + (s.esLaTuya ? ' (la tuya)' : ''), s.usuario, s.visitas, vence]) {
      const celda = document.createElement('td');
      celda.textContent = valor;
      fila.appendChild(celda);
    }
    cuerpo.appendChild(fila);
  }
}

// Autocompleta <usuario>12345 al cambiar el <select>, intercepta el submit del formulario con preventDefault() y conecta todos los botones con data-url.
async function refrescarTodo() {
  await refrescarEstado();
  await refrescarSesiones();
}

$('usuario').addEventListener('change', () => {
  $('contrasena').value = `${$('usuario').value}12345`;
});

$('form-login').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const cuerpo = { usuario: $('usuario').value, contrasena: $('contrasena').value };
  const { status, datos } = await llamar('POST', '/api/login', cuerpo);
  anotar('POST', '/api/login', status, datos);
  await refrescarTodo();
});

for (const boton of document.querySelectorAll('[data-url]')) {
  boton.addEventListener('click', async () => {
    const { metodo, url } = boton.dataset;
    const { status, datos } = await llamar(metodo, url);
    anotar(metodo, url, status, datos);
    await refrescarTodo();
  });
}

$('btn-refrescar').addEventListener('click', refrescarTodo);
$('btn-sesiones').addEventListener('click', refrescarSesiones);

// Hace un nuevo GET  para mostrarlo en config y ejecutar el refrescarTodo()
llamar('GET', '/api/config').then(({ datos }) => {
  $('config').textContent = JSON.stringify(datos, null, 2);
});
refrescarTodo();



// La presentaciòn de progra web se basara en tener montado el servido, se pasará al frente y se preguntara código. 3 preguntas por integrante de donde sea
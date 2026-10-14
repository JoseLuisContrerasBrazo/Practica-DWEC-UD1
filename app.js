// Datos iniciales de la aplicación.
let participantes = [
  {
    id: 483721,
    nombre: "Ana García",
    edad: 17,
    tipo: "estudiante",
    modalidad: "presencial",
    experiencia: 4,
    fechaInscripcion: "2026-10-08T08:30:00.000Z",
  },
  {
    id: 593204,
    nombre: "Luis Martín",
    edad: 28,
    tipo: "profesional",
    modalidad: "online",
    experiencia: 7.5,
    fechaInscripcion: "2026-10-08T09:15:00.000Z",
  },
  {
    id: 714356,
    nombre: "Marta López",
    edad: 35,
    tipo: "invitado",
    modalidad: "presencial",
    experiencia: 2.5,
    fechaInscripcion: "2026-10-08T10:00:00.000Z",
  },
];

const formulario = document.querySelector("#formulario");
const nombre = document.getElementById("nombre");
const edad = document.querySelector("#edad");
const tipo = document.querySelector("#tipo");
const modalidad = document.querySelector("#modalidad");
const experiencia = document.querySelector("#experiencia");
const errores = document.querySelector("#errores");
const lista = document.querySelector("#listaParticipantes");
const estadisticas = document.querySelector("#estadisticas");
const resultadoFiltro = document.querySelector("#resultadoFiltro");
const busqueda = document.querySelector("#busqueda");
const filtroModalidad = document.querySelector("#filtroModalidad");
const primerMenor = document.querySelector("#primerMenor");
const jsonDatos = document.querySelector("#jsonDatos");
const estadoJson = document.querySelector("#estadoJson");
const panelEvento = document.querySelector("#panelEvento");
const preferencias = document.querySelector("#preferencias");
const tema = document.querySelector("#tema");
const tamano = document.querySelector("#tamano");
const estadoPreferencias = document.querySelector("#estadoPreferencias");

let ventanaAyuda = null;

// Pasa la fecha ISO a formato español.
function formatoFecha(fechaTexto) {
  const fecha = new Date(fechaTexto);

  if (Number.isNaN(fecha.getTime())) {
    return "Fecha no válida";
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(fecha);
}

// Clasifica la experiencia.
function clasificarExperiencia(valor) {
  if (valor < 4) {
    return "Inicial";
  } else if (valor < 7) {
    return "Intermedia";
  }

  return "Avanzada";
}

// Texto que se muestra para cada tipo.
function nombreTipo(valor) {
  switch (valor) {
    case "estudiante":
      return "Estudiante";
    case "profesional":
      return "Profesional";
    case "invitado":
      return "Invitado";
    default:
      return "Desconocido";
  }
}

// Crea una tarjeta sin usar innerHTML.
function crearTarjeta(participante) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta");
  tarjeta.dataset.id = String(participante.id);

  const titulo = document.createElement("h3");
  titulo.textContent = participante.nombre;

  const edadTexto = document.createElement("p");
  const clasificacionEdad =
    participante.edad >= 18 ? "Mayor de edad" : "Menor de edad";
  edadTexto.textContent =
    "Edad: " + participante.edad + " años · " + clasificacionEdad;

  const tipoTexto = document.createElement("p");
  tipoTexto.textContent = "Tipo: " + nombreTipo(participante.tipo);

  const modalidadTexto = document.createElement("p");
  modalidadTexto.textContent = "Modalidad: " + participante.modalidad;

  const experienciaTexto = document.createElement("p");
  experienciaTexto.textContent =
    "Experiencia: " +
    participante.experiencia +
    " · " +
    clasificarExperiencia(participante.experiencia);

  const idTexto = document.createElement("p");
  idTexto.textContent = "ID: " + participante.id;

  const fechaTexto = document.createElement("p");
  fechaTexto.textContent =
    "Inscripción: " + formatoFecha(participante.fechaInscripcion);

  const borrar = document.createElement("button");
  borrar.type = "button";
  borrar.textContent = "Borrar";

  borrar.addEventListener("click", function () {
    const confirmado = confirm(
      "¿Quieres borrar a " + participante.nombre + "?",
    );

    if (!confirmado) {
      return;
    }

    for (let i = 0; i < participantes.length; i++) {
      if (participantes[i].id === participante.id) {
        participantes.splice(i, 1);
        break;
      }
    }

    tarjeta.remove();
    actualizarInterfaz();
  });

  tarjeta.append(
    titulo,
    edadTexto,
    tipoTexto,
    modalidadTexto,
    experienciaTexto,
    idTexto,
    fechaTexto,
    borrar,
  );

  return tarjeta;
}

// Aplica búsqueda y modalidad.
function obtenerParticipantesFiltrados() {
  const texto = busqueda.value.trim().toLowerCase();
  const modalidadElegida = filtroModalidad.value;
  const encontrados = [];

  for (const participante of participantes) {
    const coincideNombre = participante.nombre.toLowerCase().includes(texto);
    const coincideModalidad =
      modalidadElegida === "todas" ||
      participante.modalidad === modalidadElegida;

    if (coincideNombre && coincideModalidad) {
      encontrados.push(participante);
    }
  }

  return encontrados;
}

// Redibuja solo las tarjetas visibles.
function mostrarParticipantes() {
  lista.textContent = "";

  const encontrados = obtenerParticipantesFiltrados();

  for (const participante of encontrados) {
    lista.append(crearTarjeta(participante));
  }

  if (encontrados.length === 0) {
    resultadoFiltro.textContent = "No hay coincidencias.";
  } else {
    resultadoFiltro.textContent =
      "Participantes mostrados: " + encontrados.length;
  }
}

function textoMedia(valor) {
  return valor === null ? "Sin datos" : valor.toFixed(2);
}

// Las estadísticas siempre usan la colección completa.
function mostrarEstadisticas() {
  const datos = calcularEstadisticas(participantes);
  estadisticas.textContent = "";

  const bloques = [
    "Total: " + datos.total,
    "Menores: " + datos.menores,
    "Mayores: " + datos.mayores,
    "Edad media: " + textoMedia(datos.edadMedia),
    "Edad mínima: " +
      (datos.edadMinima === null ? "Sin datos" : datos.edadMinima),
    "Edad máxima: " +
      (datos.edadMaxima === null ? "Sin datos" : datos.edadMaxima),
    "Presencial: " + datos.modalidades.presencial,
    "Online: " + datos.modalidades.online,
    "Estudiantes: " + datos.tipos.estudiantes,
    "Profesionales: " + datos.tipos.profesionales,
    "Invitados: " + datos.tipos.invitados,
    "Experiencia media presencial: " +
      textoMedia(datos.experienciaMediaPresencial),
  ];

  for (const texto of bloques) {
    const p = document.createElement("p");
    p.textContent = texto;
    estadisticas.append(p);
  }

  let menor = null;

  for (const participante of participantes) {
    if (participante.edad < 18) {
      menor = participante;
      break;
    }
  }

  primerMenor.textContent =
    menor === null
      ? "Primer menor de edad: No hay ninguno."
      : "Primer menor de edad: " + menor.nombre;
}

function actualizarPanel() {
  if (!panelEvento.contentWindow) {
    return;
  }

  const datos = crearResumenPanel();
  enviarAlPanel(datos);
}

// Prepara los datos que necesita el iframe.
function crearResumenPanel() {
  let reciente = null;

  for (const participante of participantes) {
    if (
      reciente === null ||
      new Date(participante.fechaInscripcion) >
        new Date(reciente.fechaInscripcion)
    ) {
      reciente = participante;
    }
  }

  const estadisticasActuales = calcularEstadisticas(participantes);

  return {
    tipo: "resumen",
    total: participantes.length,
    presencial: estadisticasActuales.modalidades.presencial,
    online: estadisticasActuales.modalidades.online,
    reciente:
      reciente === null
        ? null
        : {
            nombre: reciente.nombre,
            fecha: reciente.fechaInscripcion,
          },
  };
}

function enviarAlPanel(datos) {
  if (panelEvento.contentWindow) {
    panelEvento.contentWindow.postMessage(datos, location.origin);
  }
}

function actualizarInterfaz() {
  mostrarParticipantes();
  mostrarEstadisticas();
  actualizarPanel();
}

// Recoge los valores actuales del formulario.
function leerFormulario() {
  return {
    nombre: nombre.value,
    edad: edad.value,
    tipo: tipo.value,
    modalidad: modalidad.value,
    experiencia: experiencia.value,
  };
}

// Alta de participantes.
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const resultado = validarParticipante(leerFormulario());

  if (!resultado.valido) {
    errores.textContent = resultado.errores.join(" ");
    return;
  }

  const id = generarId(participantes);

  if (id === null) {
    errores.textContent = "No se ha podido generar un identificador libre.";
    return;
  }

  const participante = {
    id,
    ...resultado.datos,
    fechaInscripcion: new Date().toISOString(),
  };

  participantes.push(participante);
  formulario.reset();
  errores.textContent = "Participante añadido correctamente.";
  actualizarInterfaz();
});

busqueda.addEventListener("input", mostrarParticipantes);
filtroModalidad.addEventListener("change", mostrarParticipantes);

document.querySelectorAll("input, select").forEach(function (campo) {
  campo.addEventListener("change", function () {
    campo.classList.remove("campo-error");
  });
});

document.getElementById("exportar").addEventListener("click", function () {
  jsonDatos.value = JSON.stringify(participantes, null, 2);
  estadoJson.textContent = "Colección exportada.";
});

document.getElementById("importar").addEventListener("click", function () {
  let datos;

  try {
    datos = JSON.parse(jsonDatos.value);
  } catch (error) {
    estadoJson.textContent = "El JSON no tiene un formato válido.";
    return;
  }

  const resultado = validarColeccionImportada(datos);

  if (!resultado.valida) {
    estadoJson.textContent = resultado.error;
    return;
  }

  participantes = datos;
  estadoJson.textContent = "Importación realizada correctamente.";
  actualizarInterfaz();
});

// Comprueba toda la importación antes de sustituir la colección.
function validarColeccionImportada(datos) {
  if (!Array.isArray(datos)) {
    return { valida: false, error: "El JSON debe contener un array." };
  }

  const ids = [];

  const camposEsperados = [
    "id",
    "nombre",
    "edad",
    "tipo",
    "modalidad",
    "experiencia",
    "fechaInscripcion",
  ];

  for (const participante of datos) {
    if (
      participante === null ||
      typeof participante !== "object" ||
      Array.isArray(participante)
    ) {
      return {
        valida: false,
        error: "Hay un participante con formato incorrecto.",
      };
    }

    for (const campo of camposEsperados) {
      if (!Object.prototype.hasOwnProperty.call(participante, campo)) {
        return {
          valida: false,
          error: "Falta un campo obligatorio en un participante.",
        };
      }
    }

    if (
      typeof participante.id !== "number" ||
      !Number.isInteger(participante.id) ||
      participante.id < 100000 ||
      participante.id > 999999
    ) {
      return { valida: false, error: "Hay un identificador no válido." };
    }

    if (
      typeof participante.nombre !== "string" ||
      typeof participante.edad !== "number" ||
      typeof participante.tipo !== "string" ||
      typeof participante.modalidad !== "string" ||
      typeof participante.experiencia !== "number" ||
      typeof participante.fechaInscripcion !== "string"
    ) {
      return {
        valida: false,
        error: "Los tipos de los campos no son válidos.",
      };
    }

    const resultado = validarParticipante(participante);

    if (!resultado.valido) {
      return { valida: false, error: "Hay datos de participante no válidos." };
    }

    if (ids.includes(participante.id)) {
      return { valida: false, error: "Hay identificadores repetidos." };
    }

    ids.push(participante.id);

    const fecha = new Date(participante.fechaInscripcion);
    if (
      Number.isNaN(fecha.getTime()) ||
      fecha.toISOString() !== participante.fechaInscripcion
    ) {
      return {
        valida: false,
        error: "La fecha debe tener formato ISO válido.",
      };
    }
  }

  return { valida: true };
}

// Aplica las clases de las preferencias.
function aplicarPreferencias() {
  document.body.classList.toggle("oscuro", tema.value === "oscuro");
  document.body.classList.toggle("grande", tamano.value === "grande");
}

// Recupera las preferencias al cargar.
function cargarPreferencias() {
  const temaGuardado = leerCookie("dwec_tema");
  const tamanoGuardado = leerCookie("dwec_tamano");

  tema.value = temaGuardado === "oscuro" ? "oscuro" : "claro";
  tamano.value = tamanoGuardado === "grande" ? "grande" : "normal";
  aplicarPreferencias();
}

preferencias.addEventListener("submit", function (evento) {
  evento.preventDefault();

  tema.value = tema.value === "oscuro" ? "oscuro" : "claro";
  tamano.value = tamano.value === "grande" ? "grande" : "normal";
  aplicarPreferencias();

  guardarCookie("dwec_tema", tema.value, 30);
  guardarCookie("dwec_tamano", tamano.value, 30);

  const guardadas =
    leerCookie("dwec_tema") === tema.value &&
    leerCookie("dwec_tamano") === tamano.value;

  estadoPreferencias.textContent = guardadas
    ? "Preferencias aplicadas y guardadas."
    : "Preferencias aplicadas. No se ha confirmado su guardado.";
});

document.querySelector("#restablecer").addEventListener("click", function () {
  borrarCookie("dwec_tema");
  borrarCookie("dwec_tamano");
  tema.value = "claro";
  tamano.value = "normal";
  aplicarPreferencias();

  const borradas =
    leerCookie("dwec_tema") === null && leerCookie("dwec_tamano") === null;

  estadoPreferencias.textContent = borradas
    ? "Preferencias restablecidas y cookies eliminadas."
    : "Aspecto restablecido. Revisa las cookies almacenadas.";
});

document.querySelector("#abrirAyuda").addEventListener("click", function () {
  if (ventanaAyuda !== null && !ventanaAyuda.closed) {
    ventanaAyuda.focus();
    return;
  }

  ventanaAyuda = window.open("ayuda.html", "ayudaEvento");

  if (ventanaAyuda === null) {
    alert("El navegador ha bloqueado la ventana de ayuda.");
  }
});

document.querySelector("#cerrarAyuda").addEventListener("click", function () {
  if (ventanaAyuda !== null && !ventanaAyuda.closed) {
    ventanaAyuda.close();
  }
});

// Recibe el aviso de que el panel ya está preparado.
window.addEventListener("message", function (evento) {
  if (evento.origin !== location.origin) {
    return;
  }

  if (evento.source !== panelEvento.contentWindow) {
    return;
  }

  const datos = evento.data;

  if (datos === null || typeof datos !== "object") {
    return;
  }

  if (datos.tipo !== "preparado" || Object.keys(datos).length !== 1) {
    return;
  }

  enviarAlPanel(crearResumenPanel());
});

// Arranque de la aplicación.
cargarPreferencias();
actualizarInterfaz();

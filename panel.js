const mensaje = document.querySelector("#mensaje");
const resumen = document.querySelector("#resumen");
const origenPrincipal = location.origin;

// El iframe actualiza su propio DOM.
function mostrarResumen(datos) {
    resumen.textContent = "";

    if (datos.total === 0) {
        mensaje.textContent = "Sin inscripciones";
        return;
    }

    mensaje.textContent = "Inscripciones actuales";

    const total = document.createElement("p");
    total.textContent = "Total: " + datos.total;

    const presencial = document.createElement("p");
    presencial.textContent = "Presencial: " + datos.presencial;

    const online = document.createElement("p");
    online.textContent = "Online: " + datos.online;

    const reciente = document.createElement("p");
    reciente.textContent = "Última inscripción: " + datos.reciente.nombre + " · " + formatoFecha(datos.reciente.fecha);

    resumen.append(total, presencial, online, reciente);
}

function formatoFecha(fechaTexto) {
    const fecha = new Date(fechaTexto);
    return new Intl.DateTimeFormat("es-ES", {
        dateStyle: "short",
        timeStyle: "short"
    }).format(fecha);
}

// Acepta solo mensajes de la página principal.
window.addEventListener("message", function (evento) {
    if (evento.origin !== origenPrincipal) {
        return;
    }

    if (evento.source !== window.parent) {
        return;
    }

    const datos = evento.data;

    if (datos === null || typeof datos !== "object") {
        return;
    }

    if (datos.tipo !== "resumen") {
        return;
    }

    if (!Number.isInteger(datos.total) || datos.total < 0) {
        return;
    }

    if (!Number.isInteger(datos.presencial) || datos.presencial < 0) {
        return;
    }

    if (!Number.isInteger(datos.online) || datos.online < 0) {
        return;
    }

    if (datos.total === 0 && datos.reciente !== null) {
        return;
    }

    if (datos.total > 0) {
        if (datos.reciente === null || typeof datos.reciente !== "object") {
            return;
        }

        if (typeof datos.reciente.nombre !== "string" || typeof datos.reciente.fecha !== "string") {
            return;
        }

        if (Number.isNaN(new Date(datos.reciente.fecha).getTime())) {
            return;
        }
    }

    mostrarResumen(datos);
});

// Aviso después de instalar el receptor.
window.parent.postMessage({ tipo: "preparado" }, origenPrincipal);

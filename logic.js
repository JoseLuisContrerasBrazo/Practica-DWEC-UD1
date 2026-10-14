// Comprueba todos los datos del formulario.
function validarParticipante(datos) {
    const errores = [];
    const nombre = typeof datos.nombre === "string" ? datos.nombre.trim() : "";
    const textoEdad = datos.edad === undefined || datos.edad === null ? "" : String(datos.edad).trim();
    const textoExperiencia = datos.experiencia === undefined || datos.experiencia === null ? "" : String(datos.experiencia).trim();
    const edad = Number(textoEdad);
    const experiencia = Number(textoExperiencia);

    if (nombre.length < 2 || nombre.length > 60) {
        errores.push("El nombre debe tener entre 2 y 60 caracteres.");
    }

    if (textoEdad === "" || !Number.isFinite(edad) || !Number.isInteger(edad) || edad < 0 || edad > 120) {
        errores.push("La edad debe ser un entero entre 0 y 120.");
    }

    if (!["estudiante", "profesional", "invitado"].includes(datos.tipo)) {
        errores.push("El tipo no es válido.");
    }

    if (!["presencial", "online"].includes(datos.modalidad)) {
        errores.push("La modalidad no es válida.");
    }

    if (textoExperiencia === "" || !Number.isFinite(experiencia) || experiencia < 0 || experiencia > 10) {
        errores.push("La experiencia debe ser un número entre 0 y 10.");
    }

    return {
        valido: errores.length === 0,
        errores,
        datos: {
            nombre,
            edad,
            tipo: datos.tipo,
            modalidad: datos.modalidad,
            experiencia
        }
    };
}

// Genera un ID libre sin quedarse en un bucle infinito.
function generarId(participantes) {
    let intentos = 0;

    while (intentos < 100) {
        const id = Math.floor(Math.random() * 900000) + 100000;
        let repetido = false;

        for (const participante of participantes) {
            if (participante.id === id) {
                repetido = true;
                break;
            }
        }

        if (!repetido) {
            return id;
        }

        intentos++;
    }

    return null;
}

// Calcula las estadísticas usando recorridos y acumuladores.
function calcularEstadisticas(participantes) {
    let menores = 0;
    let mayores = 0;
    let sumaEdades = 0;
    let sumaExperienciaPresencial = 0;
    let cantidadPresencial = 0;
    let online = 0;
    let presencial = 0;
    let estudiantes = 0;
    let profesionales = 0;
    let invitados = 0;
    let edadMinima = null;
    let edadMaxima = null;

    for (const participante of participantes) {
        sumaEdades += participante.edad;

        if (participante.edad < 18) {
            menores++;
        } else {
            mayores++;
        }

        if (edadMinima === null || participante.edad < edadMinima) {
            edadMinima = participante.edad;
        }

        if (edadMaxima === null || participante.edad > edadMaxima) {
            edadMaxima = participante.edad;
        }

        switch (participante.modalidad) {
            case "presencial":
                presencial++;
                break;
            case "online":
                online++;
                break;
        }

        switch (participante.tipo) {
            case "estudiante":
                estudiantes++;
                break;
            case "profesional":
                profesionales++;
                break;
            case "invitado":
                invitados++;
                break;
        }

        if (participante.modalidad === "online") {
            continue;
        }

        sumaExperienciaPresencial += participante.experiencia;
        cantidadPresencial++;
    }

    return {
        total: participantes.length,
        menores,
        mayores,
        edadMedia: participantes.length > 0 ? sumaEdades / participantes.length : null,
        edadMinima,
        edadMaxima,
        modalidades: { presencial, online },
        tipos: { estudiantes, profesionales, invitados },
        experienciaMediaPresencial: cantidadPresencial > 0
            ? sumaExperienciaPresencial / cantidadPresencial
            : null
    };
}

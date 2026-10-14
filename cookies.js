// Busca una cookie concreta.
function leerCookie(nombre) {
    const prefijo = nombre + "=";
    const partes = document.cookie.split(";");

    for (const parteSinLimpiar of partes) {
        const parte = parteSinLimpiar.trim();

        if (parte.startsWith(prefijo)) {
            try {
                return decodeURIComponent(parte.slice(prefijo.length));
            } catch (error) {
                return null;
            }
        }
    }

    return null;
}

// Guarda una preferencia durante los días indicados.
function guardarCookie(nombre, valor, dias) {
    const segundos = Math.floor(dias * 24 * 60 * 60);
    let atributos = "; Path=/; Max-Age=" + segundos + "; SameSite=Lax";

    if (location.protocol === "https:") {
        atributos += "; Secure";
    }

    document.cookie = nombre + "=" + encodeURIComponent(valor) + atributos;
}

// Caduca la cookie usando el mismo ámbito.
function borrarCookie(nombre) {
    let atributos = "; Path=/; Max-Age=0; SameSite=Lax";

    if (location.protocol === "https:") {
        atributos += "; Secure";
    }

    document.cookie = nombre + "=" + atributos;
}

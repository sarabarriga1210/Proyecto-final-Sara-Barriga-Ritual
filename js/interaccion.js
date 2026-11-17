


let elementoHora = document.getElementById("hora");

function actualizarReloj() {
    let ahora = new Date();

    let horas = String(ahora.getHours()).padStart(2, "0");
    let minutos = String(ahora.getMinutes()).padStart(2, "0");
    let segundos = String(ahora.getSeconds()).padStart(2, "0");

    elementoHora.textContent = horas + ":" + minutos + ":" + segundos;
}

actualizarReloj();
setInterval(actualizarReloj, 1000);




let remitente = document.getElementById("remitente");
let tipoNotificacion = document.getElementById("tipo-notificacion");
let fotoPerfil = document.getElementById("foto-perfil");
let mensajeNotificacion = document.getElementById("mensaje-notificacion");

let listaRespuestas = document.getElementById("lista-respuestas");
let contadorPendientes = document.getElementById("contador-pendientes");

let casillaRespuesta = document.getElementById("casilla-respuesta");
let textoCasilla = document.getElementById("texto-casilla");

let contenedorPantalla = document.getElementById("contenedor-pantalla");




let notificaciones = [];
let numeroNotificacion = 0;

let respuestaArrastrada = null;
let posicionX = 0;
let posicionY = 0;
let posicionInicialX = 0;
let posicionInicialY = 0;

let procesando = false;




fetch("datos.json")
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datos) {
        notificaciones = datos;
        mostrarNotificacion();
    })
    .catch(function(error) {
        console.log("No se pudieron cargar las notificaciones.", error);
        textoCasilla.textContent = "ERROR AL CARGAR LOS DATOS";
    });




function mostrarNotificacion() {

    let notificacionActual = notificaciones[numeroNotificacion];

    remitente.textContent = notificacionActual.remitente;
    tipoNotificacion.textContent = notificacionActual.tipo.toUpperCase();
    fotoPerfil.src = notificacionActual.imagen;
    mensajeNotificacion.textContent = notificacionActual.mensaje;

    contadorPendientes.textContent =
        (notificaciones.length - numeroNotificacion) + " PENDIENTES";

    textoCasilla.textContent = "ARRASTRE LA RESPUESTA AQUÍ";

    listaRespuestas.innerHTML = "";

    for (let i = 0; i < notificacionActual.respuestas.length; i++) {

        let nuevaRespuesta = document.createElement("div");

        nuevaRespuesta.className = "respuesta";
        nuevaRespuesta.textContent = notificacionActual.respuestas[i];

        listaRespuestas.appendChild(nuevaRespuesta);

        nuevaRespuesta.ontouchstart = function(evento) {
            iniciarArrastre(evento, nuevaRespuesta);
        };

    }
}



function iniciarArrastre(evento, respuesta) {

    if (procesando == true) {
        return;
    }

    evento.preventDefault();

    respuestaArrastrada = respuesta;

    let posicion = respuesta.getBoundingClientRect();

    posicionInicialX = posicion.left;
    posicionInicialY = posicion.top;

    posicionX = evento.touches[0].clientX - posicion.left;
    posicionY = evento.touches[0].clientY - posicion.top;

    respuesta.style.width = posicion.width + "px";
    respuesta.style.left = posicion.left + "px";
    respuesta.style.top = posicion.top + "px";

    respuesta.className = "respuesta arrastrada";

    document.ontouchmove = moverRespuesta;
    document.ontouchend = terminarArrastre;
    document.ontouchcancel = terminarArrastre;

}



function moverRespuesta(evento) {

    evento.preventDefault();

    let dedo = evento.touches[0];

    respuestaArrastrada.style.left =
        (dedo.clientX - posicionX) + "px";

    respuestaArrastrada.style.top =
        (dedo.clientY - posicionY) + "px";

}




function terminarArrastre(evento) {

    let dedo = evento.changedTouches[0];

    let posicionCasilla = casillaRespuesta.getBoundingClientRect();

    let dentroDeCasilla =
        dedo.clientX >= posicionCasilla.left &&
        dedo.clientX <= posicionCasilla.right &&
        dedo.clientY >= posicionCasilla.top &&
        dedo.clientY <= posicionCasilla.bottom;

    document.ontouchmove = null;
    document.ontouchend = null;
    document.ontouchcancel = null;

    respuestaArrastrada.className = "respuesta";

    respuestaArrastrada.style.position = "";
    respuestaArrastrada.style.left = "";
    respuestaArrastrada.style.top = "";
    respuestaArrastrada.style.width = "";

    if (dentroDeCasilla == true) {
        registrarRespuesta();
    }

    respuestaArrastrada = null;

}




function registrarRespuesta() {

    procesando = true;

    textoCasilla.textContent = "RESPUESTA REGISTRADA";

    numeroNotificacion++;

    contadorPendientes.textContent =
        (notificaciones.length - numeroNotificacion) + " PENDIENTES";

    if (numeroNotificacion == notificaciones.length) {

        contenedorPantalla.className = "finalizado";

        contadorPendientes.textContent = "0 PENDIENTES";

        setTimeout(function() {
            window.location.href = "cuota.html";
        }, 1800);

    } else {

        setTimeout(function() {
            mostrarNotificacion();
            procesando = false;
        }, 700);

    }

}


/* ELEMENTOS DE LA PANTALLA */

let hora = document.getElementById("hora");

let remitente = document.getElementById("remitente");
let tipoNotificacion = document.getElementById("tipo-notificacion");
let fotoPerfil = document.getElementById("foto-perfil");
let mensajeNotificacion = document.getElementById("mensaje-notificacion");

let listaRespuestas = document.getElementById("lista-respuestas");
let contadorPendientes = document.getElementById("contador-pendientes");

let casillaRespuesta = document.getElementById("casilla-respuesta");
let textoCasilla = document.getElementById("texto-casilla");

let contenedorPantalla = document.getElementById("contenedor-pantalla");


/* VARIABLES */

let notificaciones = [];
let numeroNotificacion = 0;

let respuestaSeleccionada = null;
let elementoArrastrado = null;

let posicionX = 0;
let posicionY = 0;

let procesando = false;

let resultadosNotificaciones = [];

let esTouch = false;
let ignorarMouseHasta = 0;


/* FUNCIONES DE SONIDO */

function reproducirEfecto(nombre, repetir) {

    if (window.parent.reproducirSonido) {

        window.parent.reproducirSonido(nombre, repetir);

    }

}

function detenerEfecto(nombre) {

    if (window.parent.detenerSonido) {

        window.parent.detenerSonido(nombre);

    }

}


/* RELOJ DE NODUZ */

let horaGuardada = localStorage.getItem("horaNoduz");

let horas = 22;
let minutos = 47;
let segundos = 0;


/* RECUPERAR LA HORA GUARDADA */

if (horaGuardada != null) {

    let partesHora = horaGuardada.split(":");

    horas = Number(partesHora[0]);
    minutos = Number(partesHora[1]);
    segundos = Number(partesHora[2]);

}


/* ACTUALIZAR EL RELOJ */

function actualizarHora() {

    let h = String(horas).padStart(2, "0");
    let m = String(minutos).padStart(2, "0");
    let s = String(segundos).padStart(2, "0");

    hora.textContent = h + ":" + m + ":" + s;

    localStorage.setItem(
        "horaNoduz",
        h + ":" + m + ":" + s
    );

    segundos++;

    if (segundos == 60) {

        segundos = 0;
        minutos++;

    }

    if (minutos == 60) {

        minutos = 0;
        horas++;

    }

    if (horas == 24) {

        horas = 0;

    }

}

actualizarHora();

setInterval(actualizarHora, 1000);


/* CARGAR LAS NOTIFICACIONES */

fetch("datos.json")

    .then(function(respuesta) {

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el archivo JSON.");
        }

        return respuesta.json();

    })

    .then(function(datos) {

        notificaciones = datos;

        resultadosNotificaciones = [];

        localStorage.setItem(
            "resultadosNotificaciones",
            JSON.stringify(resultadosNotificaciones)
        );

        mostrarNotificacion();

    })

    .catch(function(error) {

        console.log("No se pudieron cargar las notificaciones.", error);

        remitente.textContent = "ERROR DEL SISTEMA";

        mensajeNotificacion.textContent =
            "No fue posible cargar tus notificaciones.";

        contadorPendientes.textContent = "ERROR";

        textoCasilla.textContent = "VERIFICA LOS DATOS DEL SISTEMA";

    });


/* MOSTRAR UNA NOTIFICACIÓN */

function mostrarNotificacion() {

    procesando = false;

    respuestaSeleccionada = null;
    elementoArrastrado = null;

    let notificacionActual = notificaciones[numeroNotificacion];

    remitente.textContent = notificacionActual.remitente;

    tipoNotificacion.textContent = notificacionActual.tipo;

    fotoPerfil.src = notificacionActual.imagen;

    mensajeNotificacion.textContent = notificacionActual.mensaje;

    contadorPendientes.textContent =
        (numeroNotificacion + 1) + " / " + notificaciones.length;

    textoCasilla.textContent = "ARRASTRA TU RESPUESTA AQUÍ";

    listaRespuestas.innerHTML = "";

    casillaRespuesta.classList.remove("seleccionada");
    casillaRespuesta.classList.remove("activa");

    /* SONIDO DE NOTIFICACIÓN */

    reproducirEfecto("notificacion", false);


    /* CREAR LAS TRES RESPUESTAS */

    for (let i = 0; i < notificacionActual.respuestas.length; i++) {

        let nuevaRespuesta = document.createElement("div");

        nuevaRespuesta.className = "respuesta";

        nuevaRespuesta.textContent =
            notificacionActual.respuestas[i].texto;

        nuevaRespuesta.dataset.numero = i;

        listaRespuestas.appendChild(nuevaRespuesta);


        /* EVENTO PARA PANTALLAS TÁCTILES */

        nuevaRespuesta.addEventListener("touchstart", function(evento) {

            iniciarArrastre(
                evento,
                nuevaRespuesta,
                true
            );

        }, { passive: false });


        /* EVENTO PARA USAR EL MOUSE */

        nuevaRespuesta.addEventListener("mousedown", function(evento) {

            if (Date.now() < ignorarMouseHasta) {
                return;
            }

            iniciarArrastre(
                evento,
                nuevaRespuesta,
                false
            );

        });

    }

}


/* INICIAR EL ARRASTRE */

function iniciarArrastre(evento, respuesta, tactil) {

    if (procesando == true || elementoArrastrado != null) {
        return;
    }

    evento.preventDefault();

    esTouch = tactil;

    if (esTouch == true) {

        ignorarMouseHasta = Date.now() + 700;

    }

    elementoArrastrado = respuesta;

    let posicion = respuesta.getBoundingClientRect();

    let dedoX;
    let dedoY;

    if (tactil == true) {

        dedoX = evento.touches[0].clientX;
        dedoY = evento.touches[0].clientY;

    } else {

        dedoX = evento.clientX;
        dedoY = evento.clientY;

    }

    posicionX = dedoX - posicion.left;
    posicionY = dedoY - posicion.top;

    respuesta.style.width = posicion.width + "px";

    respuesta.style.left = posicion.left + "px";

    respuesta.style.top = posicion.top + "px";

    respuesta.classList.add("arrastrada");

    /* SONIDO AL COMENZAR A ARRASTRAR */

    reproducirEfecto("arrastrar", false);


    /* ACTIVAR LOS EVENTOS DE MOVIMIENTO */

    if (tactil == true) {

        document.addEventListener("touchmove", moverRespuesta, {
            passive: false
        });

        document.addEventListener("touchend", terminarArrastre);

        document.addEventListener("touchcancel", terminarArrastre);

    } else {

        document.addEventListener("mousemove", moverRespuesta);

        document.addEventListener("mouseup", terminarArrastre);

    }

}


/* MOVER LA RESPUESTA */

function moverRespuesta(evento) {

    if (elementoArrastrado == null) {
        return;
    }

    evento.preventDefault();

    let dedoX;
    let dedoY;

    if (esTouch == true) {

        if (evento.touches.length == 0) {
            return;
        }

        dedoX = evento.touches[0].clientX;
        dedoY = evento.touches[0].clientY;

    } else {

        dedoX = evento.clientX;
        dedoY = evento.clientY;

    }

    elementoArrastrado.style.left =
        (dedoX - posicionX) + "px";

    elementoArrastrado.style.top =
        (dedoY - posicionY) + "px";


    /* COMPROBAR SI ESTÁ SOBRE LA CASILLA */

    let posicionCasilla = casillaRespuesta.getBoundingClientRect();

    let dentroDeCasilla =
        dedoX >= posicionCasilla.left &&
        dedoX <= posicionCasilla.right &&
        dedoY >= posicionCasilla.top &&
        dedoY <= posicionCasilla.bottom;

    if (dentroDeCasilla == true) {

        casillaRespuesta.classList.add("activa");

    } else {

        casillaRespuesta.classList.remove("activa");

    }

}


/* TERMINAR EL ARRASTRE */

function terminarArrastre(evento) {

    if (elementoArrastrado == null) {
        return;
    }

    let dedoX;
    let dedoY;

    if (esTouch == true) {

        let dedo = evento.changedTouches[0];

        dedoX = dedo.clientX;
        dedoY = dedo.clientY;

    } else {

        dedoX = evento.clientX;
        dedoY = evento.clientY;

    }


    /* COMPROBAR SI LA RESPUESTA LLEGÓ A LA CASILLA */

    let posicionCasilla = casillaRespuesta.getBoundingClientRect();

    let dentroDeCasilla =
        dedoX >= posicionCasilla.left &&
        dedoX <= posicionCasilla.right &&
        dedoY >= posicionCasilla.top &&
        dedoY <= posicionCasilla.bottom;


    /* QUITAR LOS EVENTOS DE MOVIMIENTO */

    document.removeEventListener("touchmove", moverRespuesta);
    document.removeEventListener("touchend", terminarArrastre);
    document.removeEventListener("touchcancel", terminarArrastre);

    document.removeEventListener("mousemove", moverRespuesta);
    document.removeEventListener("mouseup", terminarArrastre);


    /* RESTAURAR LA RESPUESTA */

    elementoArrastrado.classList.remove("arrastrada");

    elementoArrastrado.style.position = "";
    elementoArrastrado.style.left = "";
    elementoArrastrado.style.top = "";
    elementoArrastrado.style.width = "";

    casillaRespuesta.classList.remove("activa");

    /* SONIDO AL SOLTAR */

    reproducirEfecto("soltar", false);


    /* REGISTRAR O DEVOLVER LA RESPUESTA */

    if (dentroDeCasilla == true) {

        let numeroRespuesta =
            Number(elementoArrastrado.dataset.numero);

        registrarRespuesta(numeroRespuesta);

    }

    elementoArrastrado = null;

}


/* REGISTRAR LA RESPUESTA ELEGIDA */

function registrarRespuesta(numeroRespuesta) {

    if (procesando == true) {
        return;
    }

    procesando = true;

    let notificacionActual = notificaciones[numeroNotificacion];

    let respuestaElegida =
        notificacionActual.respuestas[numeroRespuesta];


    /* GUARDAR LA INFORMACIÓN DE LA RESPUESTA */

    let resultado = {

        remitente: notificacionActual.remitente,

        tipo: notificacionActual.tipo,

        respuesta: respuestaElegida.texto,

        clasificacion: respuestaElegida.clasificacion,

        desviacion: respuestaElegida.desviacion,

        consecuencia: respuestaElegida.consecuencia

    };


    resultadosNotificaciones.push(resultado);

    localStorage.setItem(
        "resultadosNotificaciones",
        JSON.stringify(resultadosNotificaciones)
    );


    /* MOSTRAR LA RESPUESTA REGISTRADA */

    textoCasilla.textContent = respuestaElegida.texto;

    casillaRespuesta.classList.add("seleccionada");


    /* AVANZAR A LA SIGUIENTE NOTIFICACIÓN */

    setTimeout(function() {

        numeroNotificacion++;

        if (numeroNotificacion < notificaciones.length) {

            mostrarNotificacion();

        } else {

            contadorPendientes.textContent = "4 / 4";

            contenedorPantalla.classList.add("finalizado");

            /* SONIDO DE TRANSICIÓN */

            reproducirEfecto("transicion", false);

            setTimeout(function() {

                window.location.href = "cuota.html";

            }, 1200);

        }

    }, 1200);

}

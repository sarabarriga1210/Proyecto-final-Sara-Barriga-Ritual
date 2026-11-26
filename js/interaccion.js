
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


/* VARIABLES */

let notificaciones = [];
let numeroNotificacion = 0;

let respuestaSeleccionada = null;
let elementoArrastrado = null;

let posicionInicialX = 0;
let posicionInicialY = 0;

let resultadosNotificaciones = [];

let procesando = false;


/* CARGAR LAS NOTIFICACIONES */

fetch("datos.json")
    .then(function(respuesta) {
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

    });


/* MOSTRAR LA HORA */

function actualizarHora() {

    let fecha = new Date();

    let horas = fecha.getHours();
    let minutos = fecha.getMinutes();

    if (horas < 10) {
        horas = "0" + horas;
    }

    if (minutos < 10) {
        minutos = "0" + minutos;
    }

    hora.textContent = horas + ":" + minutos;

}

actualizarHora();

setInterval(actualizarHora, 1000);


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


    /* CREAR LAS TRES RESPUESTAS */

    for (let i = 0; i < notificacionActual.respuestas.length; i++) {

        let nuevaRespuesta = document.createElement("div");

        nuevaRespuesta.className = "respuesta";

        nuevaRespuesta.textContent =
            notificacionActual.respuestas[i].texto;

        nuevaRespuesta.dataset.numero = i;

        listaRespuestas.appendChild(nuevaRespuesta);


        /* INICIAR EL ARRASTRE */

        nuevaRespuesta.ontouchstart = function(evento) {

            if (procesando == true) {
                return;
            }

            evento.preventDefault();

            let toque = evento.touches[0];

            elementoArrastrado = nuevaRespuesta;

            posicionInicialX = toque.clientX;
            posicionInicialY = toque.clientY;

            nuevaRespuesta.classList.add("arrastrando");

        };


        /* MOVER LA RESPUESTA */

        nuevaRespuesta.ontouchmove = function(evento) {

            if (elementoArrastrado != nuevaRespuesta) {
                return;
            }

            evento.preventDefault();

            let toque = evento.touches[0];

            let movimientoX = toque.clientX - posicionInicialX;
            let movimientoY = toque.clientY - posicionInicialY;

            nuevaRespuesta.style.transform =
                "translate(" + movimientoX + "px, " + movimientoY + "px)";

        };


        /* SOLTAR LA RESPUESTA */

        nuevaRespuesta.ontouchend = function(evento) {

            if (elementoArrastrado != nuevaRespuesta) {
                return;
            }

            let rectanguloCasilla =
                casillaRespuesta.getBoundingClientRect();

            let rectanguloRespuesta =
                nuevaRespuesta.getBoundingClientRect();

            let centroX =
                rectanguloRespuesta.left + rectanguloRespuesta.width / 2;

            let centroY =
                rectanguloRespuesta.top + rectanguloRespuesta.height / 2;


            /* COMPROBAR SI SE SOLTÓ DENTRO DE LA CASILLA */

            if (
                centroX >= rectanguloCasilla.left &&
                centroX <= rectanguloCasilla.right &&
                centroY >= rectanguloCasilla.top &&
                centroY <= rectanguloCasilla.bottom
            ) {

                let numeroRespuesta =
                    parseInt(nuevaRespuesta.dataset.numero);

                registrarRespuesta(numeroRespuesta);

            } else {

                nuevaRespuesta.style.transform = "translate(0px, 0px)";

                nuevaRespuesta.classList.remove("arrastrando");

            }

            elementoArrastrado = null;

        };

    }

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


    /* GUARDAR TODA LA INFORMACIÓN */

    let resultado = {

        remitente: notificacionActual.remitente,

        tipo: notificacionActual.tipo,

        respuesta: respuestaElegida.texto,

        clasificacion: respuestaElegida.clasificacion,

        desviacion: respuestaElegida.desviacion,

        impactos: respuestaElegida.impactos,

        consecuencia: respuestaElegida.consecuencia

    };


    resultadosNotificaciones.push(resultado);

    localStorage.setItem(
        "resultadosNotificaciones",
        JSON.stringify(resultadosNotificaciones)
    );


    /* MOSTRAR LA RESPUESTA ELEGIDA */

    textoCasilla.textContent = respuestaElegida.texto;

    casillaRespuesta.classList.add("seleccionada");


    /* AVANZAR A LA SIGUIENTE NOTIFICACIÓN */

    setTimeout(function() {

        numeroNotificacion++;

        if (numeroNotificacion < notificaciones.length) {

            mostrarNotificacion();

        } else {

            window.location.href = "cuota.html";

        }

    }, 1200);

}

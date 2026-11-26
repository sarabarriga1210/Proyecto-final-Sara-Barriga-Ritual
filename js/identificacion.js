
/* ELEMENTOS DE LA PANTALLA */

const hora = document.getElementById("hora");
const aro = document.getElementById("aro");
const huella = document.getElementById("huella");
const mensaje = document.getElementById("mensaje");
const puntaje = document.getElementById("puntaje");
const botonContinuar = document.getElementById("boton-continuar");


/* VARIABLES */

let tiempoInicio;
let intervalo;
let progreso = 0;
let tiempoNecesario = 3000;
let completado = false;


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


/* INICIAR LA MEDICIÓN */

function iniciarMedicion(event) {

    event.preventDefault();

    if (completado == true) {
        return;
    }

    clearInterval(intervalo);

    progreso = 0;

    aro.style.background =
        "conic-gradient(#8fbf88 0deg, #263b27 0deg)";

    puntaje.textContent = "";

    mensaje.textContent = "LEYENDO HUELLA DIGITAL...";

    tiempoInicio = Date.now();

    intervalo = setInterval(actualizarProgreso, 30);

}


/* ACTUALIZAR EL PROGRESO DEL ARO */

function actualizarProgreso() {

    let tiempoActual = Date.now();

    let tiempoTranscurrido = tiempoActual - tiempoInicio;

    progreso = (tiempoTranscurrido / tiempoNecesario) * 360;

    if (progreso >= 360) {

        progreso = 360;

        clearInterval(intervalo);

        finalizarMedicion();

    }

    aro.style.background =
        "conic-gradient(#8fbf88 " + progreso + "deg, #263b27 " + progreso + "deg)";

}


/* CANCELAR LA MEDICIÓN SI SE SUELTA ANTES */

function terminarMedicion() {

    clearInterval(intervalo);

    if (completado == true) {
        return;
    }

    if (progreso < 360) {

        progreso = 0;

        aro.style.background =
            "conic-gradient(#8fbf88 0deg, #263b27 0deg)";

        mensaje.textContent = "ERROR: MEDICIÓN INCOMPLETA.";

        puntaje.textContent =
            "Su rendimiento no puede ser medido.";

    }

}


/* FINALIZAR LA MEDICIÓN */

function finalizarMedicion() {

    completado = true;

    mensaje.textContent = "MEDICIÓN COMPLETADA.";

    let resultado = Math.floor(Math.random() * 30) + 40;

    puntaje.textContent = "PRODUCTIVIDAD: " + resultado + "%";


    /* GUARDAR EL PUNTAJE PARA LA PÁGINA DE RESULTADOS */

    localStorage.setItem(
        "puntajeProductividad",
        resultado
    );


    /* MOSTRAR EL BOTÓN DE CONTINUAR */

    setTimeout(function() {

        botonContinuar.style.display = "flex";

        setTimeout(function() {

            botonContinuar.style.opacity = "1";

        }, 100);

    }, 2000);

}


/* CONTINUAR CON EL PROTOCOLO */

function continuarProtocolo(event) {

    event.preventDefault();

    window.location.href = "interaccion.html";

}


/* EVENTOS PARA PANTALLAS TÁCTILES */

huella.addEventListener("touchstart", iniciarMedicion, { passive: false });

document.addEventListener("touchend", terminarMedicion);

document.addEventListener("touchcancel", terminarMedicion);

botonContinuar.addEventListener("touchstart", continuarProtocolo, { passive: false });


/* EVENTOS PARA USAR EL MOUSE */

huella.addEventListener("mousedown", iniciarMedicion);

document.addEventListener("mouseup", terminarMedicion);

botonContinuar.addEventListener("click", continuarProtocolo);

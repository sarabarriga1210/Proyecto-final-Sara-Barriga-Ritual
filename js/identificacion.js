
/* ELEMENTOS DE LA PANTALLA */

const hora = document.getElementById("hora");
const aro = document.getElementById("aro");
const huella = document.getElementById("huella");
const mensaje = document.getElementById("mensaje");
const puntaje = document.getElementById("puntaje");
const botonContinuar = document.getElementById("boton-continuar");


/* VARIABLES DE LA MEDICIÓN */

let tiempoInicio;
let intervalo;
let progreso = 0;

let tiempoNecesario = 3000;

let completado = false;
let navegacionIniciada = false;


/* CONTROL DE SONIDOS */

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


/* RECUPERAR LA HORA DE NODUZ */

let horaGuardada = localStorage.getItem("horaNoduz");

let horas = 22;
let minutos = 47;
let segundos = 0;


/* SEPARAR LA HORA GUARDADA */

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

    segundos = segundos + 1;

    if (segundos == 60) {

        segundos = 0;
        minutos = minutos + 1;

    }

    if (minutos == 60) {

        minutos = 0;
        horas = horas + 1;

    }

    if (horas == 24) {

        horas = 0;

    }

}

actualizarHora();

setInterval(actualizarHora, 1000);


/* INICIAR LA MEDICIÓN */

function iniciarMedicion(evento) {

    evento.preventDefault();

    if (completado == true) {
        return;
    }

    /* EVITAR REINICIAR UNA MEDICIÓN YA ACTIVA */

    if (tiempoInicio != undefined) {
        return;
    }

    clearInterval(intervalo);

    progreso = 0;

    aro.style.background =
        "conic-gradient(#8fbf88 0deg, #263b27 0deg)";

    puntaje.textContent = "";

    mensaje.textContent = "LEYENDO HUELLA DIGITAL...";

    tiempoInicio = Date.now();

    /* INICIAR SONIDO DE ESCANEO EN BUCLE */

    reproducirEfecto("escaneo", true);

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


/* CANCELAR SI SE SUELTA ANTES DE LOS TRES SEGUNDOS */

function terminarMedicion() {

    clearInterval(intervalo);

    if (completado == true) {
        return;
    }

    if (progreso < 360 && tiempoInicio != undefined) {

        /* DETENER EL SONIDO DE ESCANEO */

        detenerEfecto("escaneo");

        progreso = 0;

        aro.style.background =
            "conic-gradient(#8fbf88 0deg, #263b27 0deg)";

        mensaje.textContent = "ERROR: MEDICIÓN INCOMPLETA.";

        puntaje.textContent =
            "Tu rendimiento no puede ser medido.";

        tiempoInicio = undefined;

    }

}


/* FINALIZAR LA MEDICIÓN */

function finalizarMedicion() {

    completado = true;

    /* DETENER ESCANEO */

    detenerEfecto("escaneo");

    /* REPRODUCIR CONFIRMACIÓN BIOMÉTRICA */

    reproducirEfecto("biometria", false);

    tiempoInicio = undefined;

    mensaje.textContent = "MEDICIÓN COMPLETADA.";

    let resultado = Math.floor(Math.random() * 30) + 40;

    puntaje.textContent = "PRODUCTIVIDAD: " + resultado + "%";


    /* GUARDAR EL RESULTADO */

    localStorage.setItem(
        "puntajeProductividad",
        resultado
    );


    /* MOSTRAR EL BOTÓN */

    setTimeout(function() {

        botonContinuar.style.display = "flex";

        setTimeout(function() {

            botonContinuar.style.opacity = "1";

        }, 100);

    }, 2000);

}


/* CONTINUAR CON EL PROTOCOLO */

function continuarProtocolo() {

    if (completado == true && navegacionIniciada == false) {

        navegacionIniciada = true;

        /* SONIDO DEL BOTÓN */

        reproducirEfecto("tap", false);

        setTimeout(function() {

            window.location.href = "interaccion.html";

        }, 150);

    }

}


/* EVENTOS PARA PANTALLAS TÁCTILES */

huella.addEventListener(
    "touchstart",
    iniciarMedicion,
    { passive: false }
);

document.addEventListener("touchend", terminarMedicion);

document.addEventListener("touchcancel", terminarMedicion);


/* EVENTOS PARA USAR EL MOUSE */

huella.addEventListener("mousedown", iniciarMedicion);

document.addEventListener("mouseup", terminarMedicion);


/* EVENTO DEL BOTÓN */

botonContinuar.addEventListener("click", continuarProtocolo);

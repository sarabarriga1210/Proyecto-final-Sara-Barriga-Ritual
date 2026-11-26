
/* ELEMENTOS DE LA PANTALLA */

const hora = document.getElementById("hora");

const barraProgreso = document.getElementById("progreso");
const porcentaje = document.getElementById("porcentaje");
const tiempo = document.getElementById("tiempo");

const mensajeEstado = document.getElementById("mensaje-estado");

const botonIniciar = document.getElementById("boton-iniciar");
const botonContinuar = document.getElementById("boton-continuar");


/* VARIABLES DE LA COMPENSACIÓN */

let tiempoNecesario = 15;

let tiempoAcumulado = 0;

let compensacionIniciada = false;
let compensacionCompletada = false;
let navegacionIniciada = false;

let ultimoMovimiento = 0;
let movimientoAnterior = null;


/* RECUPERAR LA HORA DE NODUZ */

let horaGuardada = localStorage.getItem("horaNoduz");

let horas = 22;
let minutos = 47;
let segundos = 0;


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


/* ACTUALIZAR LA BARRA DE PROGRESO */

function actualizarPantalla() {

    let avance = (tiempoAcumulado / tiempoNecesario) * 100;

    if (avance > 100) {
        avance = 100;
    }

    barraProgreso.style.width = avance + "%";

    porcentaje.textContent = Math.floor(avance) + "%";

    let segundosActuales = Math.floor(tiempoAcumulado);

    let segundosTexto = String(segundosActuales).padStart(2, "0");

    tiempo.textContent =
        "00:" + segundosTexto + " / 00:15";

}


/* DETECTAR EL MOVIMIENTO DEL CELULAR */

function detectarMovimiento(evento) {

    if (
        compensacionIniciada == false ||
        compensacionCompletada == true
    ) {

        return;

    }

    let aceleracion = evento.acceleration;

    if (
        aceleracion == null ||
        aceleracion.x == null ||
        aceleracion.y == null ||
        aceleracion.z == null
    ) {

        aceleracion = evento.accelerationIncludingGravity;

    }

    if (aceleracion == null) {
        return;
    }

    let x = aceleracion.x || 0;
    let y = aceleracion.y || 0;
    let z = aceleracion.z || 0;

    let ahora = Date.now();


    /* GUARDAR EL PRIMER REGISTRO DE MOVIMIENTO */

    if (movimientoAnterior == null) {

        movimientoAnterior = {
            x: x,
            y: y,
            z: z
        };

        return;

    }


    /* COMPARAR EL MOVIMIENTO ACTUAL CON EL ANTERIOR */

    let cambioX = x - movimientoAnterior.x;
    let cambioY = y - movimientoAnterior.y;
    let cambioZ = z - movimientoAnterior.z;

    let intensidad = Math.sqrt(
        cambioX * cambioX +
        cambioY * cambioY +
        cambioZ * cambioZ
    );


    movimientoAnterior = {
        x: x,
        y: y,
        z: z
    };


    /* REGISTRAR ÚNICAMENTE MOVIMIENTOS SUFICIENTES */

    if (
        intensidad > 2.5 &&
        ahora - ultimoMovimiento > 80
    ) {

        let tiempoMovimiento = 0.1;

        if (ultimoMovimiento != 0) {

            tiempoMovimiento = (ahora - ultimoMovimiento) / 1000;

            if (tiempoMovimiento > 0.15) {
                tiempoMovimiento = 0.15;
            }

            if (tiempoMovimiento < 0.08) {
                tiempoMovimiento = 0.08;
            }

        }

        ultimoMovimiento = ahora;

        tiempoAcumulado = tiempoAcumulado + tiempoMovimiento;

        if (tiempoAcumulado > tiempoNecesario) {

            tiempoAcumulado = tiempoNecesario;

        }

        actualizarPantalla();

        if (tiempoAcumulado >= tiempoNecesario) {

            finalizarCompensacion();

        }

    }

}


/* INICIAR LA COMPENSACIÓN */

async function iniciarCompensacion() {

    if (compensacionIniciada == true) {
        return;
    }


    /* COMPROBAR QUE SEA UN DISPOSITIVO MÓVIL */

    let esMovil =
        ("ontouchstart" in window) ||
        (navigator.maxTouchPoints > 0);

    if (esMovil == false) {

        mensajeEstado.textContent =
            "ESTE PROTOCOLO REQUIERE UN DISPOSITIVO MÓVIL.";

        return;

    }


    /* COMPROBAR QUE EL NAVEGADOR PERMITA EL SENSOR */

    if (typeof DeviceMotionEvent == "undefined") {

        mensajeEstado.textContent =
            "TU DISPOSITIVO NO PERMITE DETECTAR MOVIMIENTO.";

        return;

    }


    /* SOLICITAR PERMISO EN IPHONE Y SAFARI */

    if (
        typeof DeviceMotionEvent.requestPermission == "function"
    ) {

        try {

            let respuesta =
                await DeviceMotionEvent.requestPermission();

            if (respuesta != "granted") {

                mensajeEstado.textContent =
                    "PERMISO DE MOVIMIENTO DENEGADO. ACTÍVALO PARA CONTINUAR.";

                return;

            }

        } catch (error) {

            mensajeEstado.textContent =
                "NO FUE POSIBLE ACTIVAR EL SENSOR DE MOVIMIENTO.";

            return;

        }

    }


    /* INICIAR LA DETECCIÓN */

    movimientoAnterior = null;
    ultimoMovimiento = 0;

    compensacionIniciada = true;

    botonIniciar.style.display = "none";

    mensajeEstado.textContent =
        "AGITA TU DISPOSITIVO PARA COMPLETAR LA COMPENSACIÓN.";

    window.addEventListener(
        "devicemotion",
        detectarMovimiento
    );

}


/* FINALIZAR LA COMPENSACIÓN */

function finalizarCompensacion() {

    compensacionCompletada = true;

    compensacionIniciada = false;

    window.removeEventListener(
        "devicemotion",
        detectarMovimiento
    );

    tiempoAcumulado = tiempoNecesario;

    actualizarPantalla();

    mensajeEstado.textContent =
        "COMPENSACIÓN ENERGÉTICA COMPLETADA.";

    localStorage.setItem(
        "compensacionEnergetica",
        "completada"
    );

    botonContinuar.hidden = false;

}


/* CONTINUAR A LA AUTORIZACIÓN */

function continuarAutorizacion() {

    if (
        compensacionCompletada == true &&
        navegacionIniciada == false
    ) {

        navegacionIniciada = true;

        window.location.href = "autorizacion.html";

    }

}


/* EVENTOS DE LOS BOTONES */

botonIniciar.addEventListener(
    "click",
    iniciarCompensacion
);

botonContinuar.addEventListener(
    "click",
    continuarAutorizacion
);

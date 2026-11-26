
/* ELEMENTOS DEL RELOJ */

let elementoHora = document.getElementById("hora");
let elementoEstado = document.getElementById("estado");


/* HORA INICIAL */

let horas = 22;
let minutos = 47;
let segundos = 0;


/* RECUPERAR LA HORA GUARDADA */

let horaGuardada = localStorage.getItem("horaNoduz");

if (horaGuardada != null) {

    let partesHora = horaGuardada.split(":");

    horas = Number(partesHora[0]);
    minutos = Number(partesHora[1]);
    segundos = Number(partesHora[2]);

}

elementoEstado.textContent = "PROTOCOLO DE DESCONEXIÓN DISPONIBLE";


/* ACTUALIZAR RELOJ */

function actualizarReloj() {

    let h = String(horas).padStart(2, "0");
    let m = String(minutos).padStart(2, "0");
    let s = String(segundos).padStart(2, "0");

    elementoHora.textContent = h + ":" + m + ":" + s;

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

actualizarReloj();

setInterval(actualizarReloj, 1000);


/* ELEMENTOS DE LOS MENSAJES */

let textoFrase1 = document.getElementById("texto-frase1");
let textoFrase2 = document.getElementById("texto-frase2");
let textoFrase3 = document.getElementById("texto-frase3");
let textoFrase4 = document.getElementById("texto-frase4");


/* CONTENIDO NARRATIVO */

textoFrase1.innerHTML = "Es 2060. Estás en tu apartamento, en el piso 34 de <b>Noduz</b>, una ciudad que nunca se apaga.";

textoFrase2.textContent = "Hoy respondiste correos, asististe a reuniones, reaccionaste a la vida de otros y compartiste información sobre tu día. Tu ciclo de actividad ha concluido.";

textoFrase3.textContent = "Tu próxima activación está programada para las 6:00 a.m. Antes de eso, es momento de tu recarga.";

textoFrase4.textContent = "Sigue las indicaciones.";


/* ELEMENTOS DE LA INSTRUCCIÓN */

let contenedorInstruccion = document.getElementById("contenedor-instruccion");
let flecha = document.getElementById("flecha");
let textoInstruccion = document.getElementById("texto-instruccion");

flecha.textContent = "↑";

textoInstruccion.textContent = "Desliza hacia arriba para iniciar";


/* ACTIVAR MÚSICA CON LA PRIMERA INTERACCIÓN */

function activarMusicaInicial() {

    if (window.parent.iniciarMusica) {

        window.parent.iniciarMusica();

    }

}

document.addEventListener(
    "pointerdown",
    activarMusicaInicial,
    { once: true }
);


/* APARICIÓN PROGRESIVA DE LOS MENSAJES */

let listo = false;

setTimeout(function () {

    textoFrase1.style.opacity = "1";

}, 1000);


setTimeout(function () {

    textoFrase2.style.opacity = "1";

}, 5000);


setTimeout(function () {

    textoFrase3.style.opacity = "1";

}, 11000);


setTimeout(function () {

    textoFrase4.style.opacity = "1";

}, 16000);


setTimeout(function () {

    contenedorInstruccion.style.opacity = "1";

    listo = true;

}, 19000);


/* NAVEGACIÓN HACIA IDENTIFICACIÓN */

let pantalla = document.getElementById("contenedor-pantalla");

let inicioY = 0;

let navegacionIniciada = false;


/* REGISTRAR EL INICIO DEL GESTO */

function empezarToque(evento) {

    if (evento.touches.length == 1) {

        inicioY = evento.touches[0].clientY;

        activarMusicaInicial();

    }

}


/* REGISTRAR EL FINAL DEL GESTO */

function terminarToque(evento) {

    if (evento.changedTouches.length == 1) {

        let finalY = evento.changedTouches[0].clientY;

        let distancia = inicioY - finalY;

        if (
            listo == true &&
            distancia > 100 &&
            navegacionIniciada == false
        ) {

            navegacionIniciada = true;

            pantalla.style.transform = "translateY(-100%)";

            setTimeout(function () {

                window.location.href = "identificacion.html";

            }, 800);

        }

    }

}


/* ACTIVAR LOS EVENTOS TÁCTILES */

pantalla.addEventListener("touchstart", empezarToque, { passive: false });

pantalla.addEventListener("touchend", terminarToque);


/* CONTROL CENTRAL DE SONIDOS DE NODUZ */


/* ELEMENTOS */

const musicaNoduz = document.getElementById("musica-noduz");
const controlMusica = document.getElementById("control-musica");


/* VOLUMEN */

musicaNoduz.volume = 0.04;

let musicaActivada = true;


/* ARCHIVOS DE AUDIO */

let archivosSonido = {
    tap: "assets/tap.mp3",
    escaneo: "assets/escaneo.mp3",
    biometria: "assets/biometria-completa.mp3",
    notificacion: "assets/notificacion.mp3",
    arrastrar: "assets/arrastrar.mp3",
    soltar: "assets/soltar.mp3",
    like: "assets/like.mp3",
    expandir: "assets/expandir.mp3",
    contraer: "assets/contraer.mp3",
    energia: "assets/energia.mp3",
    energiaCompleta: "assets/energia-completa.mp3",
    alarma: "assets/alarma-outcast.mp3",
    apagado: "assets/apagado.mp3",
    transicion: "assets/transicion.mp3"
};


/* GUARDAR LOS REPRODUCTORES */

let sonidosNoduz = {};


/* INICIAR MÚSICA */

function iniciarMusica() {

    if (musicaActivada == false) {
        return;
    }

    if (musicaNoduz.paused) {

        musicaNoduz.play().catch(function(error) {

            console.log("No se pudo iniciar la música:", error);

        });

    }

}


/* ENCENDER O APAGAR MÚSICA */

function cambiarMusica() {

    if (musicaActivada == true) {

        musicaActivada = false;

        musicaNoduz.pause();

        controlMusica.textContent = "♫ MÚSICA: APAGADA";

    } else {

        musicaActivada = true;

        controlMusica.textContent = "♫ MÚSICA: ACTIVADA";

        iniciarMusica();

    }

}


/* REPRODUCIR UN EFECTO */

function reproducirSonido(nombre, repetir) {

    if (archivosSonido[nombre] == undefined) {
        return;
    }

    if (sonidosNoduz[nombre] == undefined) {

        sonidosNoduz[nombre] = new Audio(
            archivosSonido[nombre]
        );

    }

    let sonido = sonidosNoduz[nombre];

    sonido.loop = repetir == true;

    sonido.volume = 0.8;

    sonido.pause();

    sonido.currentTime = 0;

    sonido.play().catch(function(error) {

        console.log("Error reproduciendo:", nombre, error);

    });

}


/* DETENER UN EFECTO */

function detenerSonido(nombre) {

    if (sonidosNoduz[nombre] != undefined) {

        let sonido = sonidosNoduz[nombre];

        sonido.pause();

        sonido.currentTime = 0;

    }

}


/* CONECTAR EL BOTÓN DE MÚSICA */

controlMusica.addEventListener("click", cambiarMusica);


/* COMPARTIR FUNCIONES CON LAS PANTALLAS */

window.iniciarMusica = iniciarMusica;

window.reproducirSonido = reproducirSonido;

window.detenerSonido = detenerSonido;

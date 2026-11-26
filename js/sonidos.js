
/* CONTROL CENTRAL DE SONIDOS DE NODUZ */

let sonidosNoduz = {};


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


/* REPRODUCTOR DE MÚSICA AMBIENTAL */

let musicaNoduz = document.getElementById("musica-noduz");

musicaNoduz.volume = 0.25;


/* INICIAR MÚSICA */

function iniciarMusica() {

    if (musicaNoduz.paused) {

        musicaNoduz.play().catch(function(error) {

            console.log("No se pudo iniciar la música:", error);

        });

    }

}


/* REPRODUCIR UN EFECTO */

function reproducirSonido(nombre, repetir) {

    if (archivosSonido[nombre] == undefined) {
        return;
    }

    /* CREAR EL AUDIO SI TODAVÍA NO EXISTE */

    if (sonidosNoduz[nombre] == undefined) {

        sonidosNoduz[nombre] = new Audio(
            archivosSonido[nombre]
        );

    }

    let sonido = sonidosNoduz[nombre];

    /* CONFIGURAR REPETICIÓN */

    sonido.loop = repetir == true;

    /* REINICIAR EL SONIDO */

    sonido.pause();
    sonido.currentTime = 0;

    sonido.play().catch(function(error) {

        console.log("No se pudo reproducir el sonido:", nombre);

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


/* PERMITIR QUE LAS OTRAS PÁGINAS UTILICEN LOS SONIDOS */

window.iniciarMusica = iniciarMusica;

window.reproducirSonido = reproducirSonido;

window.detenerSonido = detenerSonido;

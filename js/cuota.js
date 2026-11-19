

/* ELEMENTOS DE LA PANTALLA */

let videoRecap = document.getElementById("video-recap");
let momentoDelDia = document.getElementById("momento-del-dia");

let contenedorVideo = document.getElementById("contenedor-video");
let contenedorSeleccion = document.getElementById("contenedor-seleccion");
let cuadriculaMomentos = document.getElementById("cuadricula-momentos");

let contadorLikes = document.getElementById("contador-likes");


/* VARIABLES */

let videos = [];
let numeroVideo = 0;
let likesDisponibles = 4;

let ultimoToque = 0;
let ultimoMomento = -1;

let procesando = false;


/* CARGAR DATOS DEL JSON */

fetch("cuota.json")
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datos) {
        videos = datos;
        mostrarVideo();
    })
    .catch(function(error) {
        console.log("No se pudieron cargar los videos.", error);
        momentoDelDia.textContent = "ERROR AL CARGAR EL RECAP";
    });


/* MOSTRAR VIDEO */

function mostrarVideo() {

    procesando = false;

    ultimoToque = 0;
    ultimoMomento = -1;

    let videoActual = videos[numeroVideo];

    momentoDelDia.textContent = videoActual.momento;

    contenedorVideo.className = "";
    contenedorSeleccion.style.display = "none";

    videoRecap.onended = function() {
        mostrarMomentos();
    };

    videoRecap.src = videoActual.video;
    videoRecap.load();
    videoRecap.play();

}


/* MOSTRAR LOS CUATRO MOMENTOS */

function mostrarMomentos() {

    contenedorVideo.className = "oculto";
    contenedorSeleccion.style.display = "block";

    cuadriculaMomentos.innerHTML = "";

    let videoActual = videos[numeroVideo];

    for (let i = 0; i < videoActual.momentos.length; i++) {

        let nuevoMomento = document.createElement("div");
        let imagenMomento = document.createElement("img");
        let corazon = document.createElement("div");

        nuevoMomento.className = "momento";
        imagenMomento.src = videoActual.momentos[i].imagen;

        corazon.className = "corazon";
        corazon.textContent = "♥";

        nuevoMomento.appendChild(imagenMomento);
        nuevoMomento.appendChild(corazon);

        cuadriculaMomentos.appendChild(nuevoMomento);

        nuevoMomento.ontouchend = function(evento) {
            evento.preventDefault();

            detectarDobleToque(i, nuevoMomento, corazon);
        };

    }

}


/* DETECTAR DOBLE TOQUE */

function detectarDobleToque(numeroMomento, cuadro, corazon) {

    if (procesando == true) {
        return;
    }

    let tiempoActual = new Date().getTime();

    if (ultimoMomento == numeroMomento &&
        tiempoActual - ultimoToque < 350) {

        registrarLike(cuadro, corazon);

        ultimoToque = 0;
        ultimoMomento = -1;

    } else {

        ultimoToque = tiempoActual;
        ultimoMomento = numeroMomento;

    }

}


/* REGISTRAR LIKE */

function registrarLike(cuadro, corazon) {

    procesando = true;

    likesDisponibles--;

    contadorLikes.textContent =
        "♥ " + likesDisponibles + " LIKES DISPONIBLES";

    cuadro.className = "momento seleccionado";
    corazon.className = "corazon visible";

    setTimeout(function() {

        numeroVideo++;

        if (numeroVideo < videos.length) {

            mostrarVideo();

        } else {

            window.location.href = "resultados.html";

        }

    }, 1000);

}

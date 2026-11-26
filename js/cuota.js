
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

let preferenciasCuota = [];
let actividadesDelDia = [];


/* CARGAR DATOS DEL JSON */

fetch("cuota.json")
    .then(function(respuesta) {

        if (!respuesta.ok) {
            throw new Error("No se encontró cuota.json");
        }

        return respuesta.json();

    })
    .then(function(datos) {

        videos = datos;

        preferenciasCuota = [];
        actividadesDelDia = [];


        /* GUARDAR LAS 16 ACTIVIDADES DEL DÍA */

        for (let i = 0; i < videos.length; i++) {

            let actividadesMomento = videos[i].momentos;

            for (let j = 0; j < actividadesMomento.length; j++) {

                let actividadActual = actividadesMomento[j];

                let actividad = {

                    id: actividadActual.id,

                    momento: videos[i].momento,

                    actividad: actividadActual.actividad,

                    areas: actividadActual.areas,

                    impactos: actividadActual.impactos,

                    mensajeSatisfaccion:
                        actividadActual.mensajeSatisfaccion,

                    protocoloEnergetico:
                        actividadActual.protocoloEnergetico || false

                };

                actividadesDelDia.push(actividad);

            }

        }


        /* GUARDAR LOS REGISTROS EN EL NAVEGADOR */

        localStorage.setItem(
            "actividadesCuota",
            JSON.stringify(actividadesDelDia)
        );

        localStorage.setItem(
            "preferenciasCuota",
            JSON.stringify(preferenciasCuota)
        );


        mostrarVideo();

    })
    .catch(function(error) {

        console.log("Error al cargar los datos:", error);

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

    videoRecap.pause();

    videoRecap.onended = function() {
        mostrarMomentos();
    };

    videoRecap.onerror = function() {

        console.log("Error al reproducir:", videoActual.video);

        momentoDelDia.textContent = "ERROR DE REPRODUCCIÓN";

    };

    videoRecap.src = videoActual.video;

    videoRecap.load();

    let reproduccion = videoRecap.play();

    if (reproduccion !== undefined) {

        reproduccion.catch(function(error) {

            console.log("No se pudo iniciar el video:", error);

        });

    }

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

        registrarLike(numeroMomento, cuadro, corazon);

        ultimoToque = 0;
        ultimoMomento = -1;

    } else {

        ultimoToque = tiempoActual;
        ultimoMomento = numeroMomento;

    }

}


/* REGISTRAR LIKE Y GUARDAR PREFERENCIA */

function registrarLike(numeroMomento, cuadro, corazon) {

    procesando = true;

    likesDisponibles--;

    contadorLikes.textContent =
        "♥ " + likesDisponibles + " LIKES DISPONIBLES";

    cuadro.className = "momento seleccionado";
    corazon.className = "corazon visible";

    let videoActual = videos[numeroVideo];

    let momentoElegido = videoActual.momentos[numeroMomento];

    let preferencia = {

        id: momentoElegido.id,

        momento: videoActual.momento,

        actividad: momentoElegido.actividad,

        areas: momentoElegido.areas,

        impactos: momentoElegido.impactos,

        mensajeSatisfaccion: momentoElegido.mensajeSatisfaccion,

        protocoloEnergetico: momentoElegido.protocoloEnergetico || false

    };

    preferenciasCuota.push(preferencia);

    localStorage.setItem(
        "preferenciasCuota",
        JSON.stringify(preferenciasCuota)
    );

    console.log("Preferencia registrada:", preferencia);

    setTimeout(function() {

        numeroVideo++;

        if (numeroVideo < videos.length) {

            mostrarVideo();

        } else {

            window.location.href = "resultados.html";

        }

    }, 1000);

}

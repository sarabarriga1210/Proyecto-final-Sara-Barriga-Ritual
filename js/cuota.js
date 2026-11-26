
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


/* FUNCIONES DE SONIDO */

function reproducirEfecto(nombre, repetir) {

    if (window.parent && window.parent.reproducirSonido) {

        window.parent.reproducirSonido(nombre, repetir);

    } else {

        console.log("No se encontró el reproductor central.");

    }

}


/* CONTINUIDAD DEL RELOJ DE NODUZ */

let horaGuardada = localStorage.getItem("horaNoduz");

let partesHora;

if (horaGuardada) {

    partesHora = horaGuardada.split(":");

} else {

    partesHora = ["22", "47", "0"];

}

let horas = Number(partesHora[0]);
let minutos = Number(partesHora[1]);
let segundos = Number(partesHora[2]);


function actualizarHoraNoduz() {

    segundos++;

    if (segundos >= 60) {

        segundos = 0;
        minutos++;

    }

    if (minutos >= 60) {

        minutos = 0;
        horas++;

    }

    if (horas >= 24) {

        horas = 0;

    }

    let h = String(horas).padStart(2, "0");
    let m = String(minutos).padStart(2, "0");
    let s = String(segundos).padStart(2, "0");

    localStorage.setItem(
        "horaNoduz",
        h + ":" + m + ":" + s
    );

}

setInterval(actualizarHoraNoduz, 1000);


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


        /* VERIFICAR LA ESTRUCTURA DEL JSON */

        if (videos.length != 4) {

            throw new Error("El recap debe tener cuatro momentos del día");

        }


        /* GUARDAR LAS 16 ACTIVIDADES DEL DÍA */

        for (let i = 0; i < videos.length; i++) {

            let actividadesMomento = videos[i].momentos;

            if (actividadesMomento.length != 4) {

                throw new Error("Cada momento debe tener cuatro actividades");

            }

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


        /* INICIAR EL RECAP */

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

    if (
        ultimoMomento == numeroMomento &&
        tiempoActual - ultimoToque < 350
    ) {

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

    if (procesando == true || likesDisponibles <= 0) {

        return;

    }

    procesando = true;


    /* REPRODUCIR SONIDO DEL LIKE */

    reproducirEfecto("like", false);


    /* ACTUALIZAR CONTADOR */

    likesDisponibles--;

    contadorLikes.textContent =
        "♥ " + likesDisponibles + " LIKES DISPONIBLES";

    cuadro.className = "momento seleccionado";
    corazon.className = "corazon visible";


    /* GUARDAR LA PREFERENCIA */

    let videoActual = videos[numeroVideo];

    let momentoElegido = videoActual.momentos[numeroMomento];

    let preferencia = {

        id: momentoElegido.id,

        momento: videoActual.momento,

        actividad: momentoElegido.actividad,

        areas: momentoElegido.areas,

        impactos: momentoElegido.impactos,

        mensajeSatisfaccion: momentoElegido.mensajeSatisfaccion,

        protocoloEnergetico:
            momentoElegido.protocoloEnergetico || false

    };

    preferenciasCuota.push(preferencia);


    /* ACTUALIZAR LAS CUATRO PREFERENCIAS */

    localStorage.setItem(
        "preferenciasCuota",
        JSON.stringify(preferenciasCuota)
    );

    console.log("Preferencia registrada:", preferencia);


    /* PASAR AL SIGUIENTE MOMENTO */

    setTimeout(function() {

        numeroVideo++;

        if (numeroVideo < videos.length) {

            mostrarVideo();

        } else {

            window.location.href = "resultados.html";

        }

    }, 1000);

}

/* GESTO DE PELLIZCO PARA AMPLIAR Y CERRAR TARJETAS */

let seccionAreas = document.getElementById("seccion-areas");

let distanciaInicial = 0;
let tarjetaSeleccionada = null;
let gestoRealizado = false;


/* EVITAR LA APERTURA NATIVA DE LAS TARJETAS */

let resumenes = document.querySelectorAll(".area summary");

for (let i = 0; i < resumenes.length; i++) {

    resumenes[i].addEventListener("click", function(evento) {

        evento.preventDefault();

    });

}


/* CALCULAR LA DISTANCIA ENTRE LOS DOS DEDOS */

function calcularDistancia(dedo1, dedo2) {

    let diferenciaX = dedo2.clientX - dedo1.clientX;
    let diferenciaY = dedo2.clientY - dedo1.clientY;

    return Math.sqrt(
        diferenciaX * diferenciaX +
        diferenciaY * diferenciaY
    );

}


/* INICIAR EL PELLIZCO */

seccionAreas.addEventListener("touchstart", function(evento) {

    if (evento.touches.length == 2) {

        let dedo1 = evento.touches[0];
        let dedo2 = evento.touches[1];

        let elemento = document.elementFromPoint(
            dedo2.clientX,
            dedo2.clientY
        );

        tarjetaSeleccionada = elemento.closest(".area");

        if (tarjetaSeleccionada != null) {

            evento.preventDefault();

            distanciaInicial = calcularDistancia(dedo1, dedo2);

            gestoRealizado = false;

        }

    }

}, { passive: false });


/* DETECTAR SI LOS DEDOS SE SEPARAN O SE JUNTAN */

seccionAreas.addEventListener("touchmove", function(evento) {

    if (
        evento.touches.length == 2 &&
        tarjetaSeleccionada != null &&
        gestoRealizado == false
    ) {

        evento.preventDefault();

        let dedo1 = evento.touches[0];
        let dedo2 = evento.touches[1];

        let distanciaActual = calcularDistancia(dedo1, dedo2);

        let cambioDistancia = distanciaActual - distanciaInicial;


        /* ABRIR TARJETA */

        if (cambioDistancia > 30) {

            tarjetaSeleccionada.open = true;
            tarjetaSeleccionada.classList.add("ampliada");

            gestoRealizado = true;

        }


        /* CERRAR TARJETA */

        if (cambioDistancia < -30) {

            tarjetaSeleccionada.open = false;
            tarjetaSeleccionada.classList.remove("ampliada");

            gestoRealizado = true;

        }

    }

}, { passive: false });


/* FINALIZAR EL PELLIZCO */

seccionAreas.addEventListener("touchend", function(evento) {

    if (evento.touches.length < 2) {

        distanciaInicial = 0;
        tarjetaSeleccionada = null;
        gestoRealizado = false;

    }

});


/* CANCELAR EL PELLIZCO */

seccionAreas.addEventListener("touchcancel", function() {

    distanciaInicial = 0;
    tarjetaSeleccionada = null;
    gestoRealizado = false;

});
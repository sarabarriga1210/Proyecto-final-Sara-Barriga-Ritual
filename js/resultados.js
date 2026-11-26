/* GESTO DE AMPLIACIÓN DE LAS TARJETAS */

let tarjetasAreas = document.getElementsByClassName("area");

function calcularDistancia(evento) {

    let dedo1 = evento.touches[0];
    let dedo2 = evento.touches[1];

    let diferenciaX = dedo2.clientX - dedo1.clientX;
    let diferenciaY = dedo2.clientY - dedo1.clientY;

    let distancia = Math.sqrt(
        diferenciaX * diferenciaX +
        diferenciaY * diferenciaY
    );

    return distancia;

}

for (let i = 0; i < tarjetasAreas.length; i++) {

    let areaActual = tarjetasAreas[i];

    let distanciaInicial = 0;
    let gestoRealizado = false;
    let ultimaY = 0;

    let empezarToque = function (evento) {

        if (evento.touches.length == 1) {
            ultimaY = evento.touches[0].clientY;
        }

        if (evento.touches.length == 2) {
            evento.preventDefault();
            distanciaInicial = calcularDistancia(evento);
            gestoRealizado = false;
        }

    };

    let moverToque = function (evento) {

        evento.preventDefault();

        if (evento.touches.length == 1) {
            let actualY = evento.touches[0].clientY;
            window.scrollBy(0, ultimaY - actualY);
            ultimaY = actualY;
        }

        if (evento.touches.length == 2) {

            let distanciaActual = calcularDistancia(evento);
            let cambioDistancia = distanciaActual - distanciaInicial;

            if (cambioDistancia > 30 && gestoRealizado == false) {
                areaActual.open = true;
                areaActual.className = "area ampliada";
                gestoRealizado = true;
            }

            if (cambioDistancia < -30 && gestoRealizado == false) {
                areaActual.open = false;
                areaActual.className = "area";
                gestoRealizado = true;
            }

        }

    };

    let terminarToque = function (evento) {

        if (evento.touches.length < 2) {
            distanciaInicial = 0;
            gestoRealizado = false;
        }

        if (evento.touches.length == 1) {
            ultimaY = evento.touches[0].clientY;
        }

    };

    let cancelarToque = function () {
        distanciaInicial = 0;
        gestoRealizado = false;
    };

    areaActual.addEventListener("touchstart", empezarToque, { passive: false });
    areaActual.addEventListener("touchmove", moverToque, { passive: false });
    areaActual.addEventListener("touchend", terminarToque);
    areaActual.addEventListener("touchcancel", cancelarToque);

    areaActual.addEventListener("toggle", function () {
        if (areaActual.open == false) {
            areaActual.className = "area";
        }
    });

}
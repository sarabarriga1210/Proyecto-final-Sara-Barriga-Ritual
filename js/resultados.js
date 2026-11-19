
/* ELEMENTOS DE LA PANTALLA */

let puntajeGeneral = document.getElementById("puntaje-general");
let mensajeGeneral = document.getElementById("mensaje-general");


/* PUNTAJES DE CADA ÁREA */

let puntajes = [42, 55, 30, 100, 25, 35, 20, 85, 80];


/* CALCULAR EL PROMEDIO GENERAL */

let suma = 0;

for (let i = 0; i < puntajes.length; i++) {

    suma = suma + puntajes[i];

}

let promedio = Math.round(suma / puntajes.length);


/* MOSTRAR RESULTADO */

puntajeGeneral.textContent = promedio + " / 100";


/* MENSAJE SEGÚN EL RESULTADO */

if (promedio >= 70) {

    mensajeGeneral.textContent =
        "SU DESEMPEÑO GENERAL CUMPLE CON LOS ESTÁNDARES DEL SISTEMA.";

} else {

    mensajeGeneral.textContent =
        "SU DESEMPEÑO GENERAL SE ENCUENTRA POR DEBAJO DE LOS ESTÁNDARES ÓPTIMOS. SIN EMBARGO, CUMPLE LOS REQUISITOS MÍNIMOS PARA LA DESCONEXIÓN.";

}


/* GESTO DE AMPLIACIÓN DE LAS TARJETAS */

let areas = document.getElementsByClassName("area");

for (let i = 0; i < areas.length; i++) {

    let areaActual = areas[i];

    let distanciaInicial = 0;
    let gestoRealizado = false;


    /* CUANDO LOS DOS DEDOS TOCAN LA TARJETA */

    areaActual.ontouchstart = function(evento) {

        if (evento.touches.length == 2) {

            evento.preventDefault();

            let dedo1 = evento.touches[0];
            let dedo2 = evento.touches[1];

            let diferenciaX = dedo2.clientX - dedo1.clientX;
            let diferenciaY = dedo2.clientY - dedo1.clientY;

            distanciaInicial = Math.sqrt(
                diferenciaX * diferenciaX +
                diferenciaY * diferenciaY
            );

            gestoRealizado = false;

        }

    };


    /* CUANDO LOS DEDOS SE MUEVEN */

    areaActual.ontouchmove = function(evento) {

        if (evento.touches.length == 2) {

            evento.preventDefault();

            let dedo1 = evento.touches[0];
            let dedo2 = evento.touches[1];

            let diferenciaX = dedo2.clientX - dedo1.clientX;
            let diferenciaY = dedo2.clientY - dedo1.clientY;

            let distanciaActual = Math.sqrt(
                diferenciaX * diferenciaX +
                diferenciaY * diferenciaY
            );

            let cambioDistancia = distanciaActual - distanciaInicial;


            /* SEPARAR LOS DEDOS: AMPLIAR */

            if (cambioDistancia > 30 && gestoRealizado == false) {

                areaActual.open = true;
                areaActual.className = "area ampliada";

                gestoRealizado = true;

            }


            /* ACERCAR LOS DEDOS: CERRAR */

            if (cambioDistancia < -30 && gestoRealizado == false) {

                areaActual.open = false;
                areaActual.className = "area";

                gestoRealizado = true;

            }

        }

    };


    /* CUANDO LOS DEDOS SE LEVANTAN */

    areaActual.ontouchend = function(evento) {

        if (evento.touches.length < 2) {

            distanciaInicial = 0;
            gestoRealizado = false;

        }

    };


    /* SI EL GESTO SE INTERRUMPE */

    areaActual.ontouchcancel = function() {

        distanciaInicial = 0;
        gestoRealizado = false;

    };

}


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

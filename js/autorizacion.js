
/* ELEMENTOS DE LA PANTALLA */

const hora = document.getElementById("hora");

const pantallaInforme = document.getElementById("pantalla-informe");
const pantallaDesconexion = document.getElementById("pantalla-desconexion");
const pantallaFinal = document.getElementById("pantalla-final");

const botonContinuar = document.getElementById("boton-continuar");
const botonDesconectar = document.getElementById("boton-desconectar");

const promedioGeneral = document.getElementById("promedio-general");
const desviaciones = document.getElementById("desviaciones");
const productividad = document.getElementById("productividad");
const compensacion = document.getElementById("compensacion");

const listaAreas = document.getElementById("lista-areas");

const tituloDesconexion = document.getElementById("titulo-desconexion");
const textoDesconexion = document.getElementById("texto-desconexion");
const tiempoRestante = document.getElementById("tiempo-restante");
const etiquetaTiempo = document.getElementById("etiqueta-tiempo");
const mensajeTiempo = document.getElementById("mensaje-tiempo");

const simboloAlerta = document.getElementById("simbolo-alerta");
const tituloFinal = document.getElementById("titulo-final");
const textoFinal = document.getElementById("texto-final");
const estadoFinal = document.getElementById("estado-final");


/* VARIABLES DEL PROTOCOLO */

let duracionRespuesta = 10;
let momentoInicio = 0;
let temporizador = null;

let alertaOutcast = false;
let desconexionRegistrada = false;


/* RECUPERAR LOS DATOS GUARDADOS */

let promedioGuardado = localStorage.getItem("promedioGeneral");
let puntajesGuardados = localStorage.getItem("puntajesAreas");

let desviacionesGuardadas = localStorage.getItem("cantidadDesviaciones");
let productividadGuardada = localStorage.getItem("puntajeProductividad");
let compensacionGuardada = localStorage.getItem("compensacionEnergetica");


/* RECUPERAR LOS PUNTAJES DE LAS NUEVE ÁREAS */

let puntajesAreas = {};

if (puntajesGuardados != null) {

    try {

        puntajesAreas = JSON.parse(puntajesGuardados);

    } catch (error) {

        puntajesAreas = {};

    }

}


/* NOMBRES DE LAS NUEVE ÁREAS */

let areas = [
    { clave: "descanso", nombre: "DESCANSO" },
    { clave: "alimentacion", nombre: "ALIMENTACIÓN" },
    { clave: "cultura", nombre: "CULTURA" },
    { clave: "higiene", nombre: "HIGIENE" },
    { clave: "salud", nombre: "SALUD" },
    { clave: "productividad", nombre: "PRODUCTIVIDAD" },
    { clave: "actividad_fisica", nombre: "ACTIVIDAD FÍSICA" },
    { clave: "medio_ambiente", nombre: "MEDIO AMBIENTE" },
    { clave: "economia", nombre: "ECONOMÍA" }
];


/* COMPROBAR QUE EXISTAN LOS NUEVE PUNTAJES */

let sumaAreas = 0;
let cantidadAreasRegistradas = 0;

for (let i = 0; i < areas.length; i++) {

    let puntaje = Number(puntajesAreas[areas[i].clave]);

    if (
        puntajesAreas[areas[i].clave] != null &&
        Number.isFinite(puntaje)
    ) {

        sumaAreas = sumaAreas + puntaje;
        cantidadAreasRegistradas = cantidadAreasRegistradas + 1;

    }

}


/* CALCULAR EL PROMEDIO REAL */

let promedio = null;

if (cantidadAreasRegistradas == 9) {

    promedio = sumaAreas / 9;

} else if (
    promedioGuardado != null &&
    Number.isFinite(Number(promedioGuardado))
) {

    promedio = Number(promedioGuardado);

}


/* MOSTRAR LOS INDICADORES GENERALES */

if (promedio != null) {

    promedioGeneral.textContent = promedio.toFixed(1) + " / 100";

} else {

    promedioGeneral.textContent = "SIN REGISTRO";

}


if (desviacionesGuardadas != null) {

    desviaciones.textContent =
        desviacionesGuardadas + " / 4";

} else {

    desviaciones.textContent = "SIN REGISTRO";

}


if (productividadGuardada != null) {

    productividad.textContent =
        productividadGuardada + " / 100";

} else {

    productividad.textContent = "SIN REGISTRO";

}


if (compensacionGuardada == "completada") {

    compensacion.textContent = "COMPLETADA";

} else {

    compensacion.textContent = "PENDIENTE";

}


/* MOSTRAR LOS NUEVE PUNTAJES */

for (let i = 0; i < areas.length; i++) {

    let fila = document.createElement("div");
    fila.className = "area-resultado";

    let nombre = document.createElement("span");
    nombre.textContent = areas[i].nombre;

    let resultado = document.createElement("strong");

    let puntaje = puntajesAreas[areas[i].clave];

    if (puntaje != null && Number.isFinite(Number(puntaje))) {

        resultado.textContent =
            Number(puntaje).toFixed(1) + " / 100";

    } else {

        resultado.textContent = "SIN REGISTRO";

    }

    fila.appendChild(nombre);
    fila.appendChild(resultado);

    listaAreas.appendChild(fila);

}


/* RELOJ DE NODUZ */

let horaGuardada = localStorage.getItem("horaNoduz");

let horas = 22;
let minutos = 47;
let segundos = 0;

if (horaGuardada != null) {

    let partesHora = horaGuardada.split(":");

    horas = Number(partesHora[0]);
    minutos = Number(partesHora[1]);
    segundos = Number(partesHora[2]);

}


function actualizarHora() {

    let h = String(horas).padStart(2, "0");
    let m = String(minutos).padStart(2, "0");
    let s = String(segundos).padStart(2, "0");

    hora.textContent = h + ":" + m + ":" + s;

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

actualizarHora();

setInterval(actualizarHora, 1000);


/* PASAR A LA SOLICITUD DE DESCONEXIÓN */

function iniciarDesconexion() {

    pantallaInforme.hidden = true;
    pantallaDesconexion.hidden = false;

    momentoInicio = Date.now();

    actualizarCuentaRegresiva();

    temporizador = setInterval(
        actualizarCuentaRegresiva,
        100
    );

}


/* CUENTA REGRESIVA */

function actualizarCuentaRegresiva() {

    let tiempoTranscurrido =
        (Date.now() - momentoInicio) / 1000;

    let tiempoDisponible =
        duracionRespuesta - tiempoTranscurrido;

    if (tiempoDisponible > 0) {

        tiempoRestante.textContent =
            Math.ceil(tiempoDisponible);

    } else {

        tiempoRestante.textContent = "00";

        activarAlertaOutcast();

    }

}


/* ACTIVAR LA ALERTA OUTCAST */

function activarAlertaOutcast() {

    if (alertaOutcast == true) {
        return;
    }

    alertaOutcast = true;

    clearInterval(temporizador);

    localStorage.setItem(
        "estadoDesconexion",
        "outcast"
    );

    localStorage.setItem(
        "outcastNoduz",
        "true"
    );

    document.body.classList.add("alerta-outcast");

    tituloDesconexion.textContent =
        "OUTCAST DETECTADO";

    textoDesconexion.textContent =
        "HAS SUPERADO EL TIEMPO DE RESPUESTA. Tu demora ha sido registrada como una anomalía de comportamiento incompatible con el protocolo de Noduz.";

    tiempoRestante.textContent = "00";

    etiquetaTiempo.textContent =
        "ALERTA DE SEGURIDAD ACTIVADA";

    botonDesconectar.textContent =
        "DESCONECTAR AHORA";

    mensajeTiempo.textContent =
        "PRESIONA AHORA. Si no confirmas tu desconexión, se notificará a las autoridades y se activará el protocolo de localización policial.";

}


/* REGISTRAR LA DESCONEXIÓN */

function desconectarAhora() {

    if (desconexionRegistrada == true) {
        return;
    }

    desconexionRegistrada = true;

    clearInterval(temporizador);

    pantallaDesconexion.hidden = true;
    pantallaFinal.hidden = false;


    /* SI PRESIONÓ DESPUÉS DE LA ALARMA */

    if (alertaOutcast == true) {

        localStorage.setItem(
            "estadoDesconexion",
            "desconexion_outcast"
        );

        tituloFinal.textContent =
            "DESCONEXIÓN REGISTRADA";

        textoFinal.textContent =
            "Tu desconexión ha sido registrada. Sin embargo, tu clasificación OUTCAST permanece activa. La alerta de comportamiento ha sido enviada al sistema central de Noduz.";

        estadoFinal.textContent =
            "REGISTRO DE ANOMALÍA // SUPERVISIÓN ACTIVA";

        simboloAlerta.textContent = "●";

    }


    /* SI PRESIONÓ ANTES DE QUE TERMINARA EL TIEMPO */

    else {

        localStorage.setItem(
            "estadoDesconexion",
            "desconexion_normal"
        );

        tituloFinal.textContent =
            "DESCONEXIÓN COMPLETADA";

        textoFinal.textContent =
            "Tu confirmación ha sido recibida dentro del tiempo establecido. Tu ciclo de actividad ha concluido. El sistema ha registrado tu desconexión.";

        estadoFinal.textContent =
            "PROTOCOLO COMPLETADO // NODUZ";

        simboloAlerta.textContent = "●";

    }

}


/* EVENTOS DE LOS BOTONES */

botonContinuar.addEventListener(
    "click",
    iniciarDesconexion
);

botonDesconectar.addEventListener(
    "click",
    desconectarAhora
);

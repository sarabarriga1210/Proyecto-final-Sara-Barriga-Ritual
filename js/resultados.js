
/* ELEMENTOS DE LA PANTALLA */

let puntajeGeneral = document.getElementById("puntaje-general");
let mensajeGeneral = document.getElementById("mensaje-general");

let puntajeDesviacion = document.getElementById("puntaje-desviacion");
let nivelDesviacion = document.getElementById("nivel-desviacion");
let detalleDesviacion = document.getElementById("detalle-desviacion");

let textoPreferencias = document.getElementById("texto-preferencias");
let listaPreferencias = document.getElementById("lista-preferencias");

let textoConclusion = document.getElementById("texto-conclusion");


/* RECUPERAR INFORMACIÓN GUARDADA */

let preferenciasCuota = JSON.parse(
    localStorage.getItem("preferenciasCuota") || "[]"
);

let resultadosNotificaciones = JSON.parse(
    localStorage.getItem("resultadosNotificaciones") || "[]"
);


/* ÁREAS Y PUNTAJES INICIALES */

let areas = {

    descanso: {
        nombre: "DESCANSO",
        puntaje: 65,
        evidencias: []
    },

    alimentacion: {
        nombre: "ALIMENTACIÓN",
        puntaje: 65,
        evidencias: []
    },

    cultura: {
        nombre: "CULTURA",
        puntaje: 65,
        evidencias: []
    },

    higiene: {
        nombre: "HIGIENE E IMAGEN CORPORAL",
        puntaje: 65,
        evidencias: []
    },

    salud: {
        nombre: "SALUD",
        puntaje: 65,
        evidencias: []
    },

    productividad: {
        nombre: "PRODUCTIVIDAD",
        puntaje: 65,
        evidencias: []
    },

    actividad_fisica: {
        nombre: "ACTIVIDAD FÍSICA",
        puntaje: 65,
        evidencias: []
    },

    medio_ambiente: {
        nombre: "CUIDADO DEL MEDIO AMBIENTE",
        puntaje: 65,
        evidencias: []
    },

    economia: {
        nombre: "ECONOMÍA",
        puntaje: 65,
        evidencias: []
    }

};


/* REGLAS DE INTERPRETACIÓN DE LAS ACTIVIDADES */

let reglasActividades = {

    despertar: {
        efectos: {
            descanso: 5,
            salud: 3
        },
        mensaje: "Consultaste tu registro de sueño. El sistema reconoce el seguimiento de tus horas de descanso."
    },

    preparar_desayuno: {
        efectos: {
            alimentacion: 5,
            economia: -2
        },
        mensaje: "Utilizaste la impresora nutricional. El sistema registra el consumo de recursos para preparar alimentos."
    },

    comer_desayuno: {
        efectos: {
            alimentacion: 7,
            salud: 4
        },
        mensaje: "Consumiste el desayuno proteico establecido. La ingesta cumple los parámetros nutricionales."
    },

    ducha: {
        efectos: {
            higiene: 6,
            salud: 2,
            medio_ambiente: -4
        },
        mensaje: "Completaste la rutina de higiene. El consumo de agua superó parcialmente la cuota ambiental."
    },

    trabajo: {
        efectos: {
            productividad: 8,
            economia: 4
        },
        mensaje: "Cumpliste actividades laborales en tu estación asignada. El sistema reconoce el tiempo productivo."
    },

    conversacion: {
        efectos: {
            salud: 4,
            productividad: -3
        },
        mensaje: "Conversaste con un compañero durante la jornada. La interacción favoreció el vínculo social, pero redujo el tiempo productivo."
    },

    salida_trabajo: {
        efectos: {
            productividad: 3
        },
        mensaje: "Registraste tu salida mediante el torniquete biométrico. El sistema verificó el cierre de tu jornada."
    },

    patineta: {
        efectos: {
            actividad_fisica: 8,
            medio_ambiente: 8
        },
        mensaje: "Utilizaste movilidad eléctrica regenerativa. La actividad favoreció el movimiento y redujo el impacto ambiental."
    },

    almuerzo: {
        efectos: {
            alimentacion: 7,
            economia: -2
        },
        mensaje: "Consumiste el almuerzo nutricional estandarizado. El sistema reconoce el cumplimiento alimentario y registra el costo de producción."
    },

    pelicula: {
        efectos: {
            cultura: -4,
            productividad: -2
        },
        mensaje: "Elegiste entretenimiento recreativo. El sistema no identificó una contribución directa a tus objetivos de actualización."
    },

    articulo: {
        efectos: {
            cultura: 8,
            productividad: 3
        },
        mensaje: "Consultaste el artículo de actualización ciudadana. El sistema reconoce tu disposición a mantenerte informado."
    },

    siesta: {
        efectos: {
            descanso: -8,
            salud: 3,
            productividad: -5
        },
        mensaje: "Registraste un periodo de sueño fuera del horario autorizado. El sistema considera que alteraste la distribución de tu descanso."
    },

    mascota: {
        efectos: {
            actividad_fisica: 7,
            medio_ambiente: 5
        },
        mensaje: "Realizaste un recorrido con tu mascota. El sistema reconoce la actividad física y el manejo responsable de residuos."
    },

    videos_cortos: {
        efectos: {
            cultura: -6,
            productividad: -5
        },
        mensaje: "Consumiste contenido de influenciadores sintéticos. El sistema no encontró evidencia de aprendizaje verificable."
    },

    skincare: {
        efectos: {
            higiene: 5,
            economia: -5
        },
        mensaje: "Completaste una rutina de cuidado facial. El sistema registra el cumplimiento estético y el consumo de productos."
    },

    videojuego: {
        efectos: {
            cultura: 3,
            productividad: -8
        },
        mensaje: "Elegiste una experiencia de reconstrucción ecológica virtual. Aunque presenta contenido ambiental, el sistema no reconoce su utilidad productiva directa."
    }

};


/* CRUZAR LOS LIKES CON LOS INDICADORES */

for (let i = 0; i < preferenciasCuota.length; i++) {

    let preferencia = preferenciasCuota[i];

    let regla = reglasActividades[preferencia.id];

    if (regla != undefined) {

        for (let area in regla.efectos) {

            areas[area].puntaje =
                areas[area].puntaje + regla.efectos[area];

            areas[area].evidencias.push(regla.mensaje);

        }

    }

}


/* RELACIONAR NOTIFICACIONES CON INDICADORES */

function obtenerAreasNotificacion(tipo) {

    if (tipo == "VÍNCULO AFECTIVO" ||
        tipo == "VÍNCULO FAMILIAR") {

        return ["salud"];

    }

    if (tipo == "TRABAJO") {

        return ["productividad", "economia"];

    }

    if (tipo == "EDUCACIÓN") {

        return ["cultura", "productividad"];

    }

    return [];

}


/* CALCULAR ACIERTOS Y DESVIACIONES */

let cantidadAciertos = 0;
let cantidadDesviaciones = 0;

for (let i = 0; i < resultadosNotificaciones.length; i++) {

    let resultado = resultadosNotificaciones[i];

    let areasRelacionadas = obtenerAreasNotificacion(resultado.tipo);

    let cambio = 0;
    let mensaje = "";

    if (resultado.clasificacion == "acierto") {

        cantidadAciertos++;

        cambio = 6;

        mensaje =
            "Tu respuesta a " + resultado.remitente +
            " fue clasificada como ACIERTO por el sistema.";

    } else if (resultado.clasificacion == "desviacion") {

        cantidadDesviaciones++;

        cambio = -12;

        mensaje =
            "Tu respuesta a " + resultado.remitente +
            " fue registrada como DESVIACIÓN CONDUCTUAL.";

    }

    for (let j = 0; j < areasRelacionadas.length; j++) {

        let nombreArea = areasRelacionadas[j];

        areas[nombreArea].puntaje =
            areas[nombreArea].puntaje + cambio;

        areas[nombreArea].evidencias.push(mensaje);

    }

}


/* LIMITAR LOS PUNTAJES ENTRE 0 Y 100 */

let puntajes = [];

for (let area in areas) {

    if (areas[area].puntaje > 100) {
        areas[area].puntaje = 100;
    }

    if (areas[area].puntaje < 0) {
        areas[area].puntaje = 0;
    }

    areas[area].puntaje = Math.round(areas[area].puntaje);

    puntajes.push(areas[area].puntaje);

}


/* MOSTRAR LOS RESULTADOS EN LAS TARJETAS */

let tarjetas = document.getElementsByClassName("area");

for (let i = 0; i < tarjetas.length; i++) {

    let tarjeta = tarjetas[i];

    let nombreArea = tarjeta.getAttribute("data-area");

    let informacion = areas[nombreArea];

    let puntajeTarjeta = tarjeta.querySelector(".puntaje");
    let explicacionTarjeta = tarjeta.querySelector(".explicacion");

    puntajeTarjeta.textContent = informacion.puntaje + "/100";

    explicacionTarjeta.innerHTML = "";

    if (informacion.evidencias.length == 0) {

        let texto = document.createElement("p");

        texto.textContent =
            "No se registraron decisiones relacionadas con esta categoría durante la evaluación.";

        explicacionTarjeta.appendChild(texto);

    } else {

        for (let j = 0; j < informacion.evidencias.length; j++) {

            let texto = document.createElement("p");

            texto.textContent =
                "- " + informacion.evidencias[j];

            explicacionTarjeta.appendChild(texto);

        }

    }

}


/* CALCULAR PROMEDIO GENERAL */

let suma = 0;

for (let i = 0; i < puntajes.length; i++) {

    suma = suma + puntajes[i];

}

let promedio = Math.round(suma / puntajes.length);

puntajeGeneral.textContent = promedio + " / 100";


if (promedio >= 70) {

    mensajeGeneral.textContent =
        "TU DESEMPEÑO GENERAL CUMPLE CON LOS ESTÁNDARES DEL SISTEMA.";

} else {

    mensajeGeneral.textContent =
        "TU DESEMPEÑO GENERAL SE ENCUENTRA POR DEBAJO DE LOS ESTÁNDARES ÓPTIMOS.";

}


/* MOSTRAR ÍNDICE DE DESVIACIÓN */

puntajeDesviacion.textContent =
    cantidadDesviaciones + " / " + resultadosNotificaciones.length;


if (cantidadDesviaciones == 0) {

    nivelDesviacion.textContent =
        "ESTADO NORMAL. NO SE DETECTARON DESVIACIONES.";

} else if (cantidadDesviaciones == 1) {

    nivelDesviacion.textContent =
        "OBSERVACIÓN. SE DETECTÓ UNA CONDUCTA INUSUAL.";

} else if (cantidadDesviaciones == 2) {

    nivelDesviacion.textContent =
        "ALERTA. SE REGISTRARON DOS DESVIACIONES CONDUCTUALES.";

} else {

    nivelDesviacion.textContent =
        "RIESGO DE EXCLUSIÓN. TU CONDUCTA PRESENTA INCOMPATIBILIDAD CON EL PROTOCOLO.";

}


/* MOSTRAR QUÉ RESPUESTAS GENERARON DESVIACIONES */

detalleDesviacion.innerHTML = "";

for (let i = 0; i < resultadosNotificaciones.length; i++) {

    let resultado = resultadosNotificaciones[i];

    if (resultado.clasificacion == "desviacion") {

        let texto = document.createElement("p");

        texto.textContent =
            "- " + resultado.remitente +
            ": \"" + resultado.respuesta + "\"";

        detalleDesviacion.appendChild(texto);

    }

}

if (cantidadDesviaciones == 0) {

    detalleDesviacion.textContent =
        "No se identificaron respuestas incompatibles con el protocolo.";

}


/* REVISIÓN DE PREFERENCIAS */

if (preferenciasCuota.length > 0) {

    textoPreferencias.textContent =
        "EL SISTEMA HA REGISTRADO LAS CUATRO ACTIVIDADES QUE ELEGISTE. TUS PREFERENCIAS HAN SIDO CRUZADAS CON LOS INDICADORES DE DESEMPEÑO.";

} else {

    textoPreferencias.textContent =
        "NO SE ENCONTRARON PREFERENCIAS REGISTRADAS.";

}

listaPreferencias.innerHTML = "";

for (let i = 0; i < preferenciasCuota.length; i++) {

    let texto = document.createElement("p");

    texto.textContent =
        "- " + preferenciasCuota[i].momento +
        ": " + preferenciasCuota[i].actividad;

    listaPreferencias.appendChild(texto);

}


/* DICTAMEN FINAL */

if (cantidadDesviaciones >= 3) {

    textoConclusion.textContent =
        "TU NIVEL DE DESVIACIÓN CONDUCTUAL SUPERA EL UMBRAL DE TOLERANCIA. TU SOLICITUD DE DESCONEXIÓN QUEDARÁ SUJETA A UNA REVISIÓN ADICIONAL. DEBERÁS COMPLETAR EL PROTOCOLO DE COMPENSACIÓN ENERGÉTICA.";

} else if (promedio < 50) {

    textoConclusion.textContent =
        "TU DESEMPEÑO GENERAL SE ENCUENTRA POR DEBAJO DEL MÍNIMO ESPERADO. EL SISTEMA RECOMIENDA CORREGIR TUS HÁBITOS Y COMPLETAR EL PROTOCOLO DE COMPENSACIÓN ENERGÉTICA ANTES DE SOLICITAR LA DESCONEXIÓN.";

} else {

    textoConclusion.textContent =
        "TU EVALUACIÓN CUMPLE CON LOS REQUISITOS MÍNIMOS DEL PROTOCOLO. SIN EMBARGO, DEBERÁS COMPLETAR EL PROCESO DE COMPENSACIÓN ENERGÉTICA ANTES DE SOLICITAR LA DESCONEXIÓN.";

}


/* GESTO DE AMPLIACIÓN DE LAS TARJETAS */

let tarjetasAreas = document.getElementsByClassName("area");

for (let i = 0; i < tarjetasAreas.length; i++) {

    let areaActual = tarjetasAreas[i];

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

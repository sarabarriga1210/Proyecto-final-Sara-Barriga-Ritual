
/* ELEMENTOS DE LA PANTALLA */

/* Resultado general */
let puntajeGeneral = document.getElementById("puntaje-general");
let mensajeGeneral = document.getElementById("mensaje-general");

/* Desviación conductual */
let puntajeDesviacion = document.getElementById("puntaje-desviacion");
let nivelDesviacion = document.getElementById("nivel-desviacion");
let detalleDesviacion = document.getElementById("detalle-desviacion");

/* Impacto de decisiones */
let tituloPreferencias = document.getElementById("titulo-preferencias");
let textoPreferencias = document.getElementById("texto-preferencias");
let listaPreferencias = document.getElementById("lista-preferencias");

/* Dictamen */
let textoConclusion = document.getElementById("texto-conclusion");


/* RECUPERAR INFORMACIÓN GUARDADA */

let preferenciasCuota = JSON.parse(
    localStorage.getItem("preferenciasCuota") || "[]"
);

let resultadosNotificaciones = JSON.parse(
    localStorage.getItem("resultadosNotificaciones") || "[]"
);


/* NOMBRES DE LAS NUEVE ÁREAS */

let areas = {

    descanso: {
        nombre: "DESCANSO",
        puntaje: 60,
        evidencias: []
    },

    alimentacion: {
        nombre: "ALIMENTACIÓN",
        puntaje: 60,
        evidencias: []
    },

    cultura: {
        nombre: "CULTURA",
        puntaje: 60,
        evidencias: []
    },

    higiene: {
        nombre: "HIGIENE E IMAGEN CORPORAL",
        puntaje: 60,
        evidencias: []
    },

    salud: {
        nombre: "SALUD",
        puntaje: 60,
        evidencias: []
    },

    productividad: {
        nombre: "PRODUCTIVIDAD",
        puntaje: 60,
        evidencias: []
    },

    actividad_fisica: {
        nombre: "ACTIVIDAD FÍSICA",
        puntaje: 60,
        evidencias: []
    },

    medio_ambiente: {
        nombre: "CUIDADO DEL MEDIO AMBIENTE",
        puntaje: 60,
        evidencias: []
    },

    economia: {
        nombre: "ECONOMÍA",
        puntaje: 60,
        evidencias: []
    }

};


/* EXPLICACIONES DE LOS IMPACTOS POR ACTIVIDAD */

let explicacionesImpactos = {

    despertar: {
        descanso: "Permite monitorear los periodos de recuperación.",
        salud: "Favorece el seguimiento de hábitos de descanso.",
        productividad: "Facilita organizar la jornada según la energía disponible."
    },

    preparar_desayuno: {
        alimentacion: "Reconoce la planificación de alimentos.",
        salud: "Favorece la preparación de una comida.",
        economia: "Consume cápsulas nutricionales adicionales.",
        medio_ambiente: "Genera residuos de los insumos utilizados.",
        productividad: "Requiere tiempo adicional de preparación."
    },

    comer_desayuno: {
        alimentacion: "Cumple el primer periodo nutricional.",
        salud: "Favorece la regularidad alimentaria.",
        productividad: "Aporta energía para iniciar la jornada.",
        economia: "Consume una ración asignada."
    },

    ducha: {
        higiene: "Cumple el indicador de higiene personal.",
        salud: "Favorece el cuidado corporal.",
        medio_ambiente: "Registra consumo de agua.",
        economia: "Consume recursos asignados."
    },

    trabajo: {
        productividad: "Cumple los objetivos asignados.",
        economia: "Contribuye a la estabilidad de ingresos.",
        salud: "La actividad laboral prolongada genera desgaste.",
        descanso: "Reduce el tiempo disponible para recuperarse."
    },

    conversacion: {
        salud: "Favorece la interacción social y el bienestar emocional.",
        productividad: "Reduce el tiempo dedicado a las tareas laborales.",
        cultura: "Permite intercambiar ideas y perspectivas."
    },

    salida_trabajo: {
        productividad: "Demuestra cumplimiento de los horarios establecidos.",
        descanso: "Protege el tiempo destinado a la recuperación.",
        salud: "Favorece una distribución equilibrada de la jornada."
    },

    patineta: {
        actividad_fisica: "Incentiva el movimiento y la movilidad activa.",
        medio_ambiente: "Reduce el uso de medios de transporte contaminantes.",
        salud: "Favorece la actividad al aire libre.",
        economia: "Reduce gastos de transporte."
    },

    almuerzo: {
        alimentacion: "Cumple el segundo periodo nutricional.",
        salud: "Favorece la regularidad de las comidas.",
        economia: "Consume recursos de la ración diaria.",
        productividad: "Mantiene la disponibilidad de energía durante la jornada.",
        medio_ambiente: "Genera residuos asociados al consumo."
    },

    pelicula: {
        cultura: "Promueve el consumo de contenido audiovisual autorizado.",
        descanso: "Permite una pausa de las obligaciones.",
        salud: "Favorece la recreación y el bienestar.",
        productividad: "Reduce el tiempo disponible para otras tareas."
    },

    articulo: {
        cultura: "Favorece el aprendizaje y la actualización de conocimientos.",
        productividad: "Fortalece las habilidades de análisis.",
        salud: "Estimula la actividad cognitiva."
    },

    siesta: {
        descanso: "Reconoce la recuperación física durante una pausa.",
        salud: "Registra el beneficio inmediato de descansar.",
        productividad: "El sistema considera que altera la programación energética."
    },

    mascota: {
        actividad_fisica: "Favorece el movimiento y la actividad al aire libre.",
        medio_ambiente: "Promueve el contacto con espacios exteriores.",
        salud: "Favorece el bienestar físico y emocional.",
        descanso: "Permite una pausa de las actividades laborales.",
        productividad: "Consume parte del tiempo programado para la rutina nocturna."
    },

    videos_cortos: {
        cultura: "Prioriza contenido de entretenimiento de bajo valor formativo según los criterios del sistema.",
        productividad: "Reduce la disponibilidad para completar actividades pendientes.",
        descanso: "Prolonga la exposición a pantallas durante la noche.",
        salud: "Puede alterar la preparación para el descanso."
    },

    skincare: {
        higiene: "Cumple el indicador de cuidado personal.",
        salud: "Favorece la rutina de cuidado corporal.",
        economia: "Consume cápsulas y productos asignados.",
        descanso: "Extiende el tiempo de la rutina nocturna."
    },

    videojuego: {
        cultura: "Favorece el aprendizaje mediante experiencias interactivas.",
        productividad: "Consume tiempo de la jornada nocturna.",
        descanso: "Proporciona un periodo breve de recreación.",
        salud: "Prolonga el tiempo de exposición a pantallas.",
        medio_ambiente: "Refuerza conocimientos sobre ecosistemas y conservación."
    }

};


/* EVALUACIÓN FIJA DE LAS 16 ACTIVIDADES */

fetch("cuota.json")

    .then(function(respuesta) {

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar cuota.json");
        }

        return respuesta.json();

    })

    .then(function(datos) {

        calcularAreas(datos);

        mostrarAreas();

        calcularPromedio();

        mostrarDesviacion();

        mostrarPreferencias();

        mostrarConclusion();

    })

    .catch(function(error) {

        console.log("Error al calcular resultados:", error);

        mensajeGeneral.textContent =
            "NO FUE POSIBLE COMPLETAR LA EVALUACIÓN.";

        textoConclusion.textContent =
            "ERROR DE LECTURA. NO SE PUDO GENERAR EL INFORME DEL SISTEMA.";

    });


/* SUMAR LOS IMPACTOS DE LAS 16 ACTIVIDADES */

function calcularAreas(datos) {

    for (let i = 0; i < datos.length; i++) {

        let actividades = datos[i].momentos;

        for (let j = 0; j < actividades.length; j++) {

            let actividadActual = actividades[j];

            let impactos = actividadActual.impactos;

            for (let nombreArea in impactos) {

                if (areas[nombreArea] != undefined) {

                    let impacto = impactos[nombreArea];

                    areas[nombreArea].puntaje =
                        areas[nombreArea].puntaje + impacto;

                    let explicacion = "Impacto registrado por esta actividad.";

                    if (
                        explicacionesImpactos[actividadActual.id] != undefined &&
                        explicacionesImpactos[actividadActual.id][nombreArea] != undefined
                    ) {

                        explicacion =
                            explicacionesImpactos[actividadActual.id][nombreArea];

                    }

                    let evidencia = {

                        actividad: actividadActual.actividad,

                        impacto: impacto,

                        explicacion: explicacion

                    };

                    areas[nombreArea].evidencias.push(evidencia);

                }

            }

        }

    }


    /* LIMITAR LOS PUNTAJES ENTRE 0 Y 100 */

    for (let nombreArea in areas) {

        if (areas[nombreArea].puntaje > 100) {
            areas[nombreArea].puntaje = 100;
        }

        if (areas[nombreArea].puntaje < 0) {
            areas[nombreArea].puntaje = 0;
        }

        areas[nombreArea].puntaje =
            Math.round(areas[nombreArea].puntaje);

    }

}


/* MOSTRAR LOS RESULTADOS EN LAS NUEVE TARJETAS */

function mostrarAreas() {

    let tarjetas = document.getElementsByClassName("area");

    for (let i = 0; i < tarjetas.length; i++) {

        let tarjeta = tarjetas[i];

        let nombreArea = tarjeta.getAttribute("data-area");

        let informacion = areas[nombreArea];

        if (informacion == undefined) {
            continue;
        }

        let puntajeTarjeta = tarjeta.querySelector(".puntaje");

        let explicacionTarjeta = tarjeta.querySelector(".explicacion");

        puntajeTarjeta.textContent =
            informacion.puntaje + "/100";

        explicacionTarjeta.innerHTML = "";


        /* MOSTRAR CADA ACTIVIDAD Y SU IMPACTO */

        for (let j = 0; j < informacion.evidencias.length; j++) {

            let evidencia = informacion.evidencias[j];

            let bloque = document.createElement("div");

            bloque.className = "evidencia-actividad";

            let nombre = document.createElement("p");

            nombre.className = "nombre-actividad";

            nombre.textContent = evidencia.actividad;

            let impacto = document.createElement("p");

            impacto.className = "impacto-actividad";

            if (evidencia.impacto > 0) {

                impacto.textContent = "+" + evidencia.impacto;

                impacto.className = "impacto-actividad positivo";

            } else {

                impacto.textContent = evidencia.impacto;

                impacto.className = "impacto-actividad negativo";

            }

            let justificacion = document.createElement("p");

            justificacion.className = "justificacion-actividad";

            justificacion.textContent = evidencia.explicacion;


            bloque.appendChild(nombre);
            bloque.appendChild(impacto);
            bloque.appendChild(justificacion);

            explicacionTarjeta.appendChild(bloque);

        }

    }

}


/* CALCULAR EL PROMEDIO GENERAL */

function calcularPromedio() {

    let suma = 0;

    let cantidadAreas = 0;

    for (let nombreArea in areas) {

        suma = suma + areas[nombreArea].puntaje;

        cantidadAreas++;

    }

    let promedio = Math.round(suma / cantidadAreas);

    puntajeGeneral.textContent = promedio + " / 100";


    /* GUARDAR EL PROMEDIO GENERAL */

    localStorage.setItem(
        "promedioGeneral",
        promedio
    );


    /* GUARDAR LOS PUNTAJES DE LAS NUEVE ÁREAS */

    let puntajesAreas = {};

    for (let nombreArea in areas) {

        puntajesAreas[nombreArea] = areas[nombreArea].puntaje;

    }

    localStorage.setItem(
        "puntajesAreas",
        JSON.stringify(puntajesAreas)
    );


    if (promedio >= 70) {

        mensajeGeneral.textContent =
            "TU DESEMPEÑO GENERAL CUMPLE CON LOS ESTÁNDARES DEL SISTEMA.";

    } else {

        mensajeGeneral.textContent =
            "TU DESEMPEÑO GENERAL SE ENCUENTRA POR DEBAJO DE LOS ESTÁNDARES ÓPTIMOS.";

    }

}


/* ÍNDICE DE DESVIACIÓN CONDUCTUAL */

function mostrarDesviacion() {

    let cantidadDesviaciones = 0;

    for (let i = 0; i < resultadosNotificaciones.length; i++) {

        if (resultadosNotificaciones[i].desviacion == true) {

            cantidadDesviaciones++;

        }

    }

    puntajeDesviacion.textContent =
        cantidadDesviaciones + " / 4";


    /* GUARDAR LA CANTIDAD DE DESVIACIONES */

    localStorage.setItem(
        "cantidadDesviaciones",
        cantidadDesviaciones
    );


    /* ESTADO VISUAL DEL ÍNDICE */

    if (cantidadDesviaciones <= 2) {

        nivelDesviacion.className = "desviacion-normal";

    } else {

        nivelDesviacion.className = "desviacion-alerta";

    }


    /* MENSAJE SEGÚN EL NÚMERO DE DESVIACIONES */

    if (cantidadDesviaciones == 0) {

        nivelDesviacion.textContent =
            "ESTADO NORMAL. NO SE DETECTARON DESVIACIONES.";

    } else if (cantidadDesviaciones == 1) {

        nivelDesviacion.textContent =
            "OBSERVACIÓN. SE DETECTÓ UNA CONDUCTA INUSUAL.";

    } else if (cantidadDesviaciones == 2) {

        nivelDesviacion.textContent =
            "ALERTA PREVENTIVA. SE REGISTRARON DOS DESVIACIONES.";

    } else {

        nivelDesviacion.textContent =
            "RIESGO DE EXCLUSIÓN. TU CONDUCTA PRESENTA INCOMPATIBILIDAD CON EL PROTOCOLO.";

    }


    /* MOSTRAR LAS CUATRO RESPUESTAS */

    detalleDesviacion.innerHTML = "";

    for (let i = 0; i < resultadosNotificaciones.length; i++) {

        let resultado = resultadosNotificaciones[i];

        let bloque = document.createElement("div");

        bloque.className = "detalle-respuesta";

        let texto = document.createElement("p");

        texto.textContent =
            resultado.remitente + ": \"" + resultado.respuesta + "\"";

        let estado = document.createElement("p");

        if (resultado.desviacion == true) {

            estado.textContent = "DESVIACIÓN DETECTADA";

            estado.className = "respuesta-desviacion";

        } else {

            estado.textContent = "RESPUESTA COMPATIBLE";

            estado.className = "respuesta-compatible";

        }

        bloque.appendChild(texto);
        bloque.appendChild(estado);

        detalleDesviacion.appendChild(bloque);

    }

    if (resultadosNotificaciones.length == 0) {

        detalleDesviacion.textContent =
            "NO SE ENCONTRARON RESPUESTAS REGISTRADAS.";

    }

}


/* IMPACTO DE TUS DECISIONES */

function mostrarPreferencias() {

    tituloPreferencias.textContent =
        "IMPACTO DE TUS DECISIONES";

    listaPreferencias.innerHTML = "";

    if (preferenciasCuota.length == 0) {

        textoPreferencias.textContent =
            "NO SE ENCONTRARON ACTIVIDADES SELECCIONADAS.";

        return;

    }

    textoPreferencias.textContent =
        "EL SISTEMA HA ANALIZADO LAS CUATRO ACTIVIDADES QUE ELEGISTE Y HA GENERADO LAS SIGUIENTES OBSERVACIONES SOBRE TUS PREFERENCIAS.";


    for (let i = 0; i < preferenciasCuota.length; i++) {

        let preferencia = preferenciasCuota[i];

        let bloque = document.createElement("div");

        bloque.className = "bloque-preferencia";

        let momento = document.createElement("p");

        momento.className = "momento-preferencia";

        momento.textContent =
            preferencia.momento + " / " + preferencia.actividad;

        let mensaje = document.createElement("p");

        mensaje.className = "mensaje-preferencia";

        mensaje.textContent =
            preferencia.mensajeSatisfaccion;

        bloque.appendChild(momento);
        bloque.appendChild(mensaje);

        listaPreferencias.appendChild(bloque);

    }

}


/* DICTAMEN FINAL DEL SISTEMA */

function mostrarConclusion() {

    let promedio = 0;

    for (let nombreArea in areas) {

        promedio = promedio + areas[nombreArea].puntaje;

    }

    promedio = Math.round(promedio / 9);


    let cantidadDesviaciones = 0;

    for (let i = 0; i < resultadosNotificaciones.length; i++) {

        if (resultadosNotificaciones[i].desviacion == true) {

            cantidadDesviaciones++;

        }

    }


    /* EL PROTOCOLO ENERGÉTICO ES OBLIGATORIO
       PORQUE LA SIESTA ESTÁ EN LA RUTINA FIJA. */

    let protocoloEnergetico = true;


    /* GUARDAR EL ESTADO INICIAL DE LA COMPENSACIÓN */

    localStorage.setItem(
        "compensacionEnergetica",
        "pendiente"
    );


    if (cantidadDesviaciones >= 3) {

        textoConclusion.textContent =
            "TU NIVEL DE DESVIACIÓN CONDUCTUAL SUPERA EL UMBRAL DE TOLERANCIA. TU SOLICITUD DE DESCONEXIÓN QUEDARÁ SUJETA A UNA REVISIÓN ADICIONAL. AUN ASÍ, DEBERÁS COMPLETAR EL PROTOCOLO DE COMPENSACIÓN ENERGÉTICA ANTES DE SOLICITAR LA DESCONEXIÓN.";

    } else if (promedio < 50) {

        textoConclusion.textContent =
            "TU DESEMPEÑO GENERAL SE ENCUENTRA POR DEBAJO DEL MÍNIMO ESPERADO. EL SISTEMA RECOMIENDA CORREGIR TUS HÁBITOS Y COMPLETAR EL PROTOCOLO DE COMPENSACIÓN ENERGÉTICA ANTES DE SOLICITAR LA DESCONEXIÓN.";

    } else if (protocoloEnergetico == true) {

        textoConclusion.textContent =
            "TU EVALUACIÓN GENERAL CUMPLE CON LOS REQUISITOS MÍNIMOS DEL PROTOCOLO. SIN EMBARGO, SE HA IDENTIFICADO UNA ALTERACIÓN EN TU PROGRAMACIÓN ENERGÉTICA. LA SIESTA REGISTRADA DURANTE LA TARDE MODIFICÓ LA DISTRIBUCIÓN DE ENERGÍA PREVISTA PARA EL PERIODO NOCTURNO. PARA GARANTIZAR LA DESCONEXIÓN Y RECUPERAR EL HORARIO DE DESCANSO, DEBERÁS COMPLETAR UNA ACTIVIDAD FÍSICA COMPENSATORIA. ESTA MEDIDA PERMITIRÁ EQUILIBRAR EL EXCEDENTE ENERGÉTICO Y COMENZAR LA SIGUIENTE JORNADA CON LA DISPOSICIÓN NECESARIA PARA CUMPLIR TUS OBJETIVOS DE PRODUCTIVIDAD.";

    }

}


/* GESTO DE AMPLIACIÓN DE LAS TARJETAS */

/* LAS TARJETAS SOLO SE ABREN Y CIERRAN
   MEDIANTE EL GESTO DE PELLIZCO EN TOUCH. */

let tarjetasAreas = document.getElementsByClassName("area");

for (let i = 0; i < tarjetasAreas.length; i++) {

    let areaActual = tarjetasAreas[i];

    let resumenArea = areaActual.querySelector("summary");

    let distanciaInicial = 0;
    let gestoRealizado = false;


    /* BLOQUEAR LA APERTURA AUTOMÁTICA POR TOQUE */

    resumenArea.addEventListener("click", function(evento) {

        evento.preventDefault();

    });


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

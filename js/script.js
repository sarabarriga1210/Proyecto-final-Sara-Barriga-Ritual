
let elementoHora = document.getElementById("hora");
let elementoEstado = document.getElementById("estado");

let horas = 22;
let minutos = 47;
let segundos = 0;

elementoEstado.innerHTML = "PROTOCOLO DE DESCONEXIÓN DISPONIBLE";

function actualizarReloj() {
  segundos = segundos + 1;

  if (segundos == 60) {
    segundos = 0;
    minutos = minutos + 1;
  }
  if (minutos == 60) {
    minutos = 0;
    horas = horas + 1;
  }

  let h = String(horas).padStart(2, "0");
  let m = String(minutos).padStart(2, "0");
  let s = String(segundos).padStart(2, "0");
  elementoHora.textContent = h + ":" + m + ":" + s;
}

actualizarReloj();
setInterval(actualizarReloj, 1000);



let textoFrase1 = document.getElementById("texto-frase1");
let textoFrase2 = document.getElementById("texto-frase2");
let textoFrase3 = document.getElementById("texto-frase3");
let textoFrase4 = document.getElementById("texto-frase4");

textoFrase1.innerHTML = "Es 2060. Estás en tu apartamento, en el piso 34 de <b>Noduz</b>, una ciudad que nunca se apaga.";
textoFrase2.innerHTML = "Hoy respondiste correos, asististe a reuniones, reaccionaste a la vida de otros y compartiste información sobre tu día. Tu ciclo de actividad ha concluido.";
textoFrase3.innerHTML = "Tu próxima activación está programada para las 6:00 a.m. Antes de eso, es momento de tu recarga.";
textoFrase4.innerHTML = "Sigue las indicaciones.";



let contenedorInstruccion = document.getElementById("contenedor-instruccion");
let flecha = document.getElementById("flecha");
let textoInstruccion = document.getElementById("texto-instruccion");

flecha.innerHTML = "↑";
textoInstruccion.innerHTML = "Deslice hacia arriba para iniciar";



let listo = false;

setTimeout(function () {
  textoFrase1.style.opacity = "1";
}, 1000);

setTimeout(function () {
  textoFrase2.style.opacity = "1";
}, 5000);

setTimeout(function () {
  textoFrase3.style.opacity = "1";
}, 11000);

setTimeout(function () {
  textoFrase4.style.opacity = "1";
}, 16000);

setTimeout(function () {
  contenedorInstruccion.style.opacity = "1";
  listo = true;
}, 19000);



let pantalla = document.getElementById("contenedor-pantalla");
let inicioY = 0;

function empezarToque(event) {
  inicioY = event.touches[0].clientY;
}

function terminarToque(event) {
  let finalY = event.changedTouches[0].clientY;
  let distancia = inicioY - finalY;

  if (listo == true && distancia > 100) {
    pantalla.style.transform = "translateY(-100%)";

    setTimeout(function () {
      window.location.href = "identificacion.html";
    }, 800);
  }
}

pantalla.addEventListener("touchstart", empezarToque, { passive: false });
pantalla.addEventListener("touchend", terminarToque);
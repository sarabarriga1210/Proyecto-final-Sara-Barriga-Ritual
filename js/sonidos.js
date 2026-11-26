
/* REPRODUCTOR DE MÚSICA DE NODUZ */

let musicaNoduz = document.getElementById("musica-noduz");

musicaNoduz.volume = 0.25;


/* INICIAR MÚSICA */

function iniciarMusica() {

    if (musicaNoduz.paused) {

        musicaNoduz.play().catch(function(error) {

            console.log("No se pudo iniciar la música:", error);

        });

    }

}


/* PERMITIR QUE LAS OTRAS PÁGINAS INICIEN LA MÚSICA */

window.iniciarMusica = iniciarMusica;

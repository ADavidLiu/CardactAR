var $canvas;
var areaCaligrafia;
var $mensajeWrapper = $(".pruebas__mensaje-wrapper");
var $mensaje = $(".pruebas__mensaje");
var $btnReiniciar = $(".pruebas__reiniciar");
var $btnSiguiente = $(".pruebas__acciones-btn--siguiente");
var puntaje = 0;

var prueba = {
    accion: "traducir",
    pregunta: "Perro",
    respuesta: "犬",
    tiempo: 20
}

function setup() {
    var caligrafia = select(".caligrafia");
    var anchoCanvas = caligrafia.width;
    areaCaligrafia = createCanvas(anchoCanvas, 400);
    areaCaligrafia.addClass("content__wrapper content__wrapper--caligrafia");
    areaCaligrafia.parent("caligrafia");
    strokeWeight(5);
    stroke("#F45C43");
    $canvas = $("canvas")[0];
}

function touchMoved() {
    line(mouseX, mouseY, pmouseX, pmouseY);
    return false;
}

$btnSiguiente.click(function () {
    checkRespuesta();
});

function checkRespuesta() {
    Tesseract.recognize($canvas, "chi_sim").then(function (result) {
        var caracteres = result.symbols[0].text;
        console.log(caracteres);
        if (caracteres === prueba.respuesta) {
            mostrarMensaje("Correcto!", 1000);
            calcularPuntaje();
        } else {
            mostrarMensaje("Incorrecto!", 1000);
            puntaje = 0;
            clearInterval(timer);
            setTimeout(function () {
                mostrarMensaje("Respuesta: " + prueba.respuesta, 1500);
                clearTimeout(this);
            }, 1500);
        }
    })
}

$btnReiniciar.click(function () {
    areaCaligrafia.clear();
});

function mostrarMensaje(texto, tiempo) {
    $mensaje.text(texto);
    $mensajeWrapper.addClass("pruebas__mensaje-wrapper--active");
    var alerta = setTimeout(function () {
        $mensajeWrapper.removeClass("pruebas__mensaje-wrapper--active");
        clearTimeout(alerta);
    }, tiempo);
}

function calcularPuntaje() {
        puntaje = tiempo;
        console.log(puntaje);
        clearInterval(timer);
    }
    
    var $tiempoRestante = $(".pruebas__tiempo-restante");
    var tiempo = prueba.tiempo;
    $tiempoRestante.text(tiempo);
    
    var timer = setInterval(function () {
        disminuirTiempo();
    }, 1000);
    
    function disminuirTiempo() {
        if (tiempo > 0) {
            tiempo--;
        } else {
            tiempo = 0;
            clearInterval(timer);
        }
        $tiempoRestante.text(tiempo);
    }
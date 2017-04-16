var $canvas;
var areaCaligrafia;
var $mensajeWrapper = $(".pruebas__mensaje-wrapper");
var $mensaje = $(".pruebas__mensaje");
var $btnReiniciar = $(".pruebas__reiniciar");
var $btnSiguiente = $(".pruebas__acciones-btn--siguiente");

var prueba = {
    accion: "traducir",
    pregunta: "Perro",
    respuesta: "犬"
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
        } else {
            mostrarMensaje("Incorrecto!", 1000);
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
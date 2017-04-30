$(document).ready(function () {

    var prueba = {
        caracter: "猫",
        respuesta: "gato",
        opciones: ["Perro", "Gato", "Caballo", "León"],
        tiempo: 10
    }
    
    var puntaje = 0;

    var $pinyin = $(".opcion__pinyin");
    var $caracter = $(".opcion__caracter");

    $caracter.text(prueba.caracter);

    function hanziToPinyin(caracter) {
        var pinyin = cjst.chineseToPinyin(caracter).join(' ');
        $pinyin.text(pinyin);
    }

    hanziToPinyin(prueba.caracter);

    var $trazado = $(".opcion__trazado-caracter");

    $trazado.text(prueba.caracter);

    function pronunciar(caracter) {
        $.speech({
            key: 'faefb5118b654670a0919a54ebb1bcbe',
            src: caracter,
            hl: 'zh-cn',
            r: 0,
            c: 'mp3',
            f: '44khz_16bit_stereo',
            ssml: false
        });
    }

    pronunciar(prueba.caracter);

    var $btnPronunciar = $(".opcion__trazado-pronunciar");

    $btnPronunciar.click(function () {
        pronunciar(prueba.caracter);
    });

    var $listaOpciones = $(".opcion__lista");

    for (var i = 0; i < prueba.opciones.length; i++) {
        $listaOpciones.append("<li class='opcion__item'>" + prueba.opciones[i] + "</li>");
    }

    var $opcionItem = $(".opcion__item");

    $opcionItem.click(function () {
        var $this = $(this);
        $opcionItem.removeClass("opcion__item--selected");
        $this.addClass("opcion__item--selected");
    });

    var $btnRevisar = $(".opcion__acciones-btn--siguiente");

    $btnRevisar.click(function () {
        checkearRespuesta();
    });
    
    var $mensaje = $(".opcion__mensaje");
    var $mensajeWrapper = $(".opcion__mensaje-wrapper");

    function mostrarMensaje(texto, tiempo) {
        $mensaje.text(texto);
        $mensajeWrapper.addClass("opcion__mensaje-wrapper--active");
        var alerta = setTimeout(function () {
            $mensajeWrapper.removeClass("opcion__mensaje-wrapper--active");
            clearTimeout(alerta);
        }, tiempo);
    }

    function checkearRespuesta() {
        var $selected = $(".opcion__item--selected");
        var respuesta = $selected.text();
        respuesta = respuesta.charAt(0).toLowerCase() + respuesta.slice(1);
        if (respuesta == prueba.respuesta) {
            console.log("Correcto");
            mostrarMensaje("Correcto!", 1000);
            calcularPuntaje();
        } else {
            console.log("Incorrecto");
            mostrarMensaje("Incorrecto!", 1000);
            puntaje = 0;
            clearInterval(timer);
            setTimeout(function () {
                mostrarMensaje("Respuesta: " + prueba.respuesta, 1500);
                clearTimeout(this);
            }, 1500);
        }
    }
    
    function calcularPuntaje() {
        puntaje = tiempo;
        console.log(puntaje);
        clearInterval(timer);
    }
    
    var $tiempoRestante = $(".opcion__tiempo-restante");
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

});

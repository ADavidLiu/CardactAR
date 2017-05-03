$(document).ready(function () {

    $('.palabra__info-item').matchHeight();

    var caracter = "猫";
    var anchoTrazado = $(".palabra__trazado").innerWidth();

    var writer = new HanziWriter("trazado", caracter, {
        showOutline: true,
        showCharacter: true,
        width: anchoTrazado,
        height: 400,
        padding: 20,
        strokeAnimationDuration: 300,
        delayBetweenStrokes: 1000,
        strokeColor: '#EB3349',
        outlineColor: 'rgba(235, 51, 73, 0.6)'
    });

    function animarCaracter() {
        writer.animateCharacter();
    }

    animarCaracter();

    var $btnReiniciar = $(".palabra__trazado-reiniciar");

    $btnReiniciar.click(function () {
        animarCaracter();
    });

    var $pinyin = $(".palabra__pinyin");
    var $caracter = $(".palabra__caracter");
    var $traduccion = $(".palabra__traduccion");

    $caracter.text(caracter);

    function hanziToPinyin(caracter) {
        var pinyin = cjst.chineseToPinyin(caracter).join(' ');
        $pinyin.text(pinyin);
    }

    function manejarTraduccion(res) {
        var traduccion = res.text[0];
        $traduccion.text(traduccion);
        definirPalabra(traduccion);
    }

    $.post("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170321T235648Z.3193900a2fbf206f.5f78e83dd4de5da554f974b1976faff175639c28&text=" + caracter + "&lang=zh-es", manejarTraduccion);

    hanziToPinyin(caracter);

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

    var $btnPronunciar = $(".palabra__pronunciacion");

    $btnPronunciar.click(function () {
        pronunciar(caracter);
    });

    var $etimologia = $(".palabra__etimologia-descripcion");

    function definirPalabra(traduccion) {
        $.post("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170321T235648Z.3193900a2fbf206f.5f78e83dd4de5da554f974b1976faff175639c28&text=" + traduccion + "&lang=es-en", function (res) {
            var traduccionIngles = res.text[0].toLowerCase();
            $.get("https://owlbot.info/api/v1/dictionary/" + traduccionIngles, manejarDefinicion);
        });
    }

    function manejarDefinicion(res) {
        console.log(res);
        var definicion = res[0].defenition;
        $.post("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170321T235648Z.3193900a2fbf206f.5f78e83dd4de5da554f974b1976faff175639c28&text=" + definicion + "&lang=en-es", function (res) {
            var definincionEspanol = res.text[0];
            $etimologia.html(definincionEspanol);
        });
    }

    var recibirCaracter = function () {
        var caracterRecibido = android.getData();
        alert(caracterRecibido);
        caracter = caracterRecibido;
    }

});

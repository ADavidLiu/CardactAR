$(document).ready(function () {

    var $input = $(".diccionario__search-input");

    $input.change(function (e) {
        var palabra = $input.val();
        buscarPalabra(palabra);
    });

    var $caracter = $(".palabra__caracter");

    function buscarPalabra(palabra) {
        // Se traduce la palabra a caracter
        $.post("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170321T235648Z.3193900a2fbf206f.5f78e83dd4de5da554f974b1976faff175639c28&text=" + palabra + "&lang=es-zh", function (res) {
            var caracter = res.text[0];
            // Se crea la estructura para el template de la palabra
            var $palabra = crearTemplate();
            $palabra.find(".palabra__caracter").text(caracter);
            // Se traduce a pinyin
            var pinyin = cjst.chineseToPinyin(caracter).join(' ');
            console.log(pinyin);
            $palabra.find(".palabra__info-item-value--pronunciacion").text(pinyin);
            // Permite la pronunciación
            $palabra.find(".palabra__info-item-play").click(function () {
                pronunciar(caracter);
            });
            // Muestra el significado
            definirPalabra(palabra, $palabra.find(".palabra__info-item-value--significado"));
        });
    }

    var $resultados = $(".diccionario__resultados");

    function crearTemplate() {
        var $estructura = $('<div class="palabra"><div class="palabra__caracter-wrapper"><h2 class="palabra__caracter"></h2></div><div class="palabra__info"><ul class="list-inline palabra__info-list"><li class="palabra__info-item palabra__info-item--pronunciacion"><span class="palabra__info-item-label">Pronunciación: </span><span class="palabra__info-item-value palabra__info-item-value--pronunciacion"></span><i class="fa fa-play palabra__info-item-play" aria-hidden="true"></i></li><li class="palabra__info-item palabra__info-item--traduccion"><span class="palabra__info-item-label">Significado: </span><span class="palabra__info-item-value palabra__info-item-value--significado"></span></li></ul></div></div>');
        $resultados.append($estructura);
        return $estructura;
    }

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

    function definirPalabra(traduccion, $elemento) {
        $.post("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170321T235648Z.3193900a2fbf206f.5f78e83dd4de5da554f974b1976faff175639c28&text=" + traduccion + "&lang=es-en", function (res) {
            var traduccionIngles = res.text[0].toLowerCase();
            $.get("https://owlbot.info/api/v1/dictionary/" + traduccionIngles, function (res) {
                var definicion = res[0].defenition;
                $.post("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170321T235648Z.3193900a2fbf206f.5f78e83dd4de5da554f974b1976faff175639c28&text=" + definicion + "&lang=en-es", function (res) {
                    var definincionEspanol = res.text[0];
                    if (definincionEspanol.length < 50) {
                        $elemento.text(definincionEspanol);
                    } else {
                        $elemento.text(definincionEspanol.substring(0, 50) + "...");
                    }
                });
            });
        });
    }

});

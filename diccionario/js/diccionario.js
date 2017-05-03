$(document).ready(function () {

    var $input = $(".diccionario__search-input");
    var $resultados = $(".diccionario__resultados-lista");
    var $relacionadas = $(".diccionario__relacionadas-lista");

    $input.change(function (e) {
        var palabra = $input.val();
        buscarPalabra(palabra, $resultados);
        buscarRelacionadas(palabra);
    });

    $input.focusin(function (e) {
        limpiarPalabras();
    });

    function limpiarPalabras() {
        $resultados.empty();
        $relacionadas.empty();
    }

    var $caracter = $(".palabra__caracter");

    function buscarPalabra(palabra, $padre) {
        // Se traduce la palabra a caracter
        $.post("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170321T235648Z.3193900a2fbf206f.5f78e83dd4de5da554f974b1976faff175639c28&text=" + palabra + "&lang=es-zh", function (res) {
            var caracter = res.text[0];
            // Se crea la estructura para el template de la palabra
            var $palabra = crearTemplate($padre);
            $palabra.find(".palabra__caracter").text(caracter);
            // Se traduce a pinyin
            var pinyin = cjst.chineseToPinyin(caracter).join(' ');
            $palabra.find(".palabra__info-item-value--pronunciacion").text(pinyin);
            // Permite la pronunciación
            $palabra.find(".palabra__info-item-play").click(function () {
                pronunciar(caracter);
            });
            // Envia el caracter a Android
            $palabra.click(function () {
                enviarCaracter(caracter);
            });
            // Se realiza la traducción
            $.post("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170321T235648Z.3193900a2fbf206f.5f78e83dd4de5da554f974b1976faff175639c28&text=" + palabra + "&lang=es-en", function (res) {
                var traduccionIngles = res.text[0].toLowerCase();
                // Muestra el significado
                definirPalabra(traduccionIngles, $palabra.find(".palabra__info-item-value--significado"));
            });
        });
    }

    function buscarRelacionadas(palabra) {
        $.post("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170321T235648Z.3193900a2fbf206f.5f78e83dd4de5da554f974b1976faff175639c28&text=" + palabra + "&lang=es-en", function (res) {
            var traduccionIngles = res.text[0];
            var relacionadas = [];
            $.get("https://api.datamuse.com/words?ml=" + traduccionIngles, function (res) {
                for (var i = 0; i < res.length / 4; i++) {
                    var palabraRelacionada = res[i].word;
 $.post("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170321T235648Z.3193900a2fbf206f.5f78e83dd4de5da554f974b1976faff175639c28&text=" + palabraRelacionada + "&lang=en-es", function (res) {
                        var palabraRelacionadaEsp = res.text[0];
                        buscarPalabra(palabraRelacionadaEsp, $relacionadas);
                    });
                }
            });
        });
    }

    function crearTemplate($padre) {
        var $estructura = $('<div class="palabra"><div class="palabra__caracter-wrapper"><h2 class="palabra__caracter"></h2></div><div class="palabra__info"><ul class="list-inline palabra__info-list"><li class="palabra__info-item palabra__info-item--pronunciacion"><span class="palabra__info-item-label">Pronunciación: </span><span class="palabra__info-item-value palabra__info-item-value--pronunciacion"></span><i class="fa fa-play palabra__info-item-play" aria-hidden="true"></i></li><li class="palabra__info-item palabra__info-item--traduccion"><span class="palabra__info-item-label">Significado: </span><span class="palabra__info-item-value palabra__info-item-value--significado"></span></li></ul></div></div>');
        $padre.append($estructura);
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

    function definirPalabra(traduccionIngles, $elemento) {
        // Definición de la palabra buscada
        $.get("https://owlbot.info/api/v1/dictionary/" + traduccionIngles, function (res) {
            var definicion = res[0].defenition;
            $.post("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170321T235648Z.3193900a2fbf206f.5f78e83dd4de5da554f974b1976faff175639c28&text=" + definicion + "&lang=en-es", function (res) {
                var definincionEspanol = res.text[0];
                console.log(definincionEspanol);
                if (definincionEspanol.length < 50) {
                    $elemento.text(definincionEspanol);
                } else {
                    $elemento.text(definincionEspanol.substring(0, 50) + "...");
                }
            });
        });
    }
    
    var enviarCaracter = function (caracter) {
        //alert(caracter);
        android.setData(caracter);
    }

});

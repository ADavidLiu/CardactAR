$(document).ready(function () {

    var app = new Clarifai.App(
        'OdH230mD2z9Ur9bOPUclmAjpn0kcw78-zX6eNzkU',
        'aRE8NXX8UttRE3r5cuw0U_SvoRCpdVLSsHlsTEPF'
    );

    function getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    var base64 = getBase64Image($(".vision__img")[0]);
    var $lista = $(".vision__list");
    var $listaTraduccion = $(".vision__list--traduccion");
    var indice = 1;

    function manejarTraduccion(res) {
        $listaTraduccion.append("<li class='vision__list-item'>" + (indice++) + ". " + res.text[0] + "</li>");
    }

    app.models.predict(Clarifai.GENERAL_MODEL, {
        base64: base64
    }).then(
        function (response) {
            console.log(response);
            var conceptos = response.data.outputs[0].data.concepts;
            for (var i = 0; i < conceptos.length; i++) {
                $lista.append("<li class='vision__list-item'>" + (i + 1) + ". " + conceptos[i].name + "</li>");
                $.post("https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20170321T235648Z.3193900a2fbf206f.5f78e83dd4de5da554f974b1976faff175639c28&text=" + conceptos[i].name + "&lang=en-zh", manejarTraduccion);
            }
        },
        function (err) {
            console.error(err);
        }
    );

    var showData = function () {
        var data = android.getData();
        data = JSON.parse(data);
        window.alert("Hello! Data are: " + data + "; first = " + data[0]);
    }

});
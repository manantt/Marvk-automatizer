// ==UserScript==
// @name         MARVK
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  try to take over the world!
// @author       Manantt, MRK.
// @match        https://s157-es.ogame.gameforge.com/*
// @grant        none
// ==/UserScript==

/******************* CONFIGURACIÓN *********************************************************/

//const config = configGeneral[configGeneral.getUsuario()];
//console.log(config);
const acciones = [
    "defensas",
    "enviarRecursos",
    "reciclar",
    "expedicion"
];
var fodder = 65000;
const defensas = {
    "fortaleza": [
        ["Lanzamisiles", "details401", parseInt(fodder/5)],
        ["Láser pequeño", "details402", fodder],
        ["Láser grande", "details403", parseInt(fodder/4)],
        ["Cañón Gauss", "details404", parseInt(fodder/30)],
        ["Cañón iónico", "details405", parseInt(fodder/12)],
        ["Cañón de plasma", "details406", parseInt(fodder/100)],
        ["Cúpula pequeña de protección", "details407", 1],
        ["Cúpula grande de protección", "details408", 1],
        ["Misiles antibalísticos", "details502", 68],
        ["Misil interplanetario", "details503", 1]
    ],
    "colonia": [
        ["Lanzamisiles", "details401", parseInt(fodder/100)],
        ["Láser pequeño", "details402", parseInt(fodder/20)],
        ["Láser grande", "details403", parseInt(fodder/80)],
        ["Cañón Gauss", "details404", parseInt(fodder/600)],
        ["Cañón iónico", "details405", parseInt(fodder/240)],
        ["Cañón de plasma", "details406", parseInt(fodder/2000)],
        ["Cúpula pequeña de protección", "details407", 1],
        ["Cúpula grande de protección", "details408", 1],
        ["Misiles antibalísticos", "details502", 30],
        ["Misil interplanetario", "details503", 0]
    ]
}
const planetas = [
    {
        "id": "33638025",
        "fortaleza": false,
        "acciones": [
            true,
            true,
            false,
            false
        ]
    },
    {
        "id": "33639675",
        "fortaleza": true,
        "acciones": [
            true,
            false,
            false,//true,
            true
        ]
    },
    {
        "id": "33641426",
        "fortaleza": false,
        "acciones": [
            true,
            true,
            false,
            false
        ]
    },
    {
        "id": "33644701",
        "fortaleza": false,
        "acciones": [
            true,
            true,
            false,
            false
        ]
    },
    {
        "id": "33651159",
        "fortaleza": false,
        "acciones": [
            true,
            true,
            false,
            false
        ]
    },
    {
        "id": "33661795",
        "fortaleza": false,
        "acciones": [
            true,
            true,
            false,
            false
        ]
    },
    {
        "id": "33679268",
        "fortaleza": false,
        "acciones": [
            true,
            true,
            false,
            false
        ]
    },
    {
        "id": "33708027",
        "fortaleza": false,
        "acciones": [
            true,
            true,
            false,
            false
        ]
    }
];

/******************* MAIN *********************************************************/
$(function() {
    accionesInstantaneas();
    crearMenu();
    /* setTimeout(function() {
      localStorage.pausa = false;
      init();
    }, 600000); */
    init();
});

if (typeof localStorage.accionActual == "undefined") {
    localStorage.accionActual = 0;
    localStorage.planetaActual = 0;
    localStorage.pausa = "true";
}
/**
 * Comprueba qué tiene que hacer el bot
 */
function init() {
    if (localStorage.pausa === "false") {
        console.log();
        if (getPlanetaSeleccionado() != localStorage.planetaActual) { //TODO
            goToPlaneta(localStorage.planetaActual);
            console.log(getPlanetaSeleccionado(), localStorage.planetaActual);
        } else {
            if (planetas[localStorage.planetaActual].acciones[localStorage.accionActual]) {
                switch (localStorage.accionActual) {
                    case "0":
                        hacerDefensas();
                        break;
                    case "1":
                        mandarRecursos();
                        break;
                    case "2":
                        recolectar();
                        break;
                    case "3":
                        expedicion();
                        break;
                    default:
                        localStorage.accionActual = 0;
                        siguientePlaneta();
                }
            } else {
                siguienteAccion();
            }
        }
    }
}

/******************* MENU *********************************************************/
/**
 * Genera los items de menú custom
 */
function crearMenu() {
    $("#menuTable").prepend("<li id='menuCustom' style='padding: 5px 0 5px 15px;'></li>");
    $("#menuCustom").append(
        '<span id="playPause" class="menu_icon custom_menu_icon">' +
        '<a href="javascript: void(0);" class="tooltipRight js_hideTipOnMobile " target="_self" title="Iniciar/Parar">' +
        '<div class=""></div>' +
        '</a>' +
        '</span>'
    );
    $("#menuCustom").append(
        '<span id="mandarExpedicion" class="menu_icon custom_menu_icon">' +
        '<a href="https://s157-es.ogame.gameforge.com/game/index.php?page=fleet1&custom=expedicion" class="tooltipRight js_hideTipOnMobile " target="_self" title="Expedición">' +
        '<div class="menuImage fleet1"></div>' +
        '</a>' +
        '</span>'
    );
    $("#menuCustom").append(
        '<span id="recolectar" class="menu_icon custom_menu_icon">' +
        '<a href="https://s157-es.ogame.gameforge.com/game/index.php?page=galaxy&custom=escanear" class="tooltipRight js_hideTipOnMobile " target="_self" title="Recolectar">' +
        '<div class="menuImage alliance"></div>' +
        '</a>' +
        '</span>'
    );
    //Estilos
    $(".custom_menu_icon").css("float", "left");
    if (localStorage.pausa == "false") {
        $("#playPause div").css('background-position', '-27px -54px');
        $("#playPause div").addClass('active');
    } else {
        $("#playPause div").css('background-position', '-0px -0px');
        $("#playPause div").removeClass('active');
    }
    $("#playPause div").css("width", "27px").css("height", "27px").css("background-image", "url(https://github.com/manantt/marvk/raw/master/images/icons.png)");
    $("#recolectar div").css("width", "27px").css("height", "27px").css("background-image", "url(https://github.com/manantt/marvk/raw/master/images/icons.png)").css('background-position', '-54px -0px');
    $("#playPause div:not(.active)").hover(function() {
        $("#playPause div").css('background-position', '-0px -54px');
    }, function() {
        $("#playPause div").css('background-position', '-0px -0px');
    });
    $("#playPause div.active").hover(function() {
        $("#playPause div").css('background-position', '-27px -27px');
    }, function() {
        $("#playPause div").css('background-position', '-27px -54px');
    });
    $("#recolectar div").hover(function() {
        $("#recolectar div").css('background-position', '-54px -54px');
    }, function() {
        $("#recolectar div").css('background-position', '-54px -0px');
    });
    //Acciones
    $("#playPause").click(function() {
        if (localStorage.pausa == "false") {
            localStorage.pausa = "true";
            localStorage.planetaActual = 0;
            localStorage.accionActual = 0;
        } else {
            localStorage.pausa = "false";
        }
        location.reload();
    });
    //Otros interfaces
    crearInterfazEscaner();
}
/**
 * Genera la vista de escaner de escombros
 */
function crearInterfazEscaner(){
    if (window.location.href.toString().indexOf("custom=escanear") != -1) {
        $("#galaxyHeader").hide();
        $("#galaxyLoading").hide();
        $("#galaxyContent").hide();
        $(".ct_foot_row.uv_s_profile_wrapper").ready(function(){
            $(this).html("");
        });
        $("#contentWrapper").append("<div id='escaner' style='width:670px;min-height:420px;background:rgba(10,15,20,0.7);color:#848484;text-align:center'></div>");
        $("#escaner").append('<div style="background:#1e252f;width:200px;height:200px;padding:20px;float:left;border:2px solid #1e252f"><div class="pie" data-x="0" style="border:1px solid #111;background-color:#222;margin:0px;width:200px;height:200px;border-radius:50%;position:relative;overflow:hidden;"><div class="clip1" style="position:absolute;top:0;left:0;width:200px;height:200px;clip:rect(0px, 200px, 200px, 100px);box-shadow:0 2px 2px rgba(0,0,0,0.2) inset;border-radius:50%;"><div class="slice1" style="position:absolute;width:200px;height:200px;clip:rect(0px, 100px, 200px, 0px);-moz-border-radius:100px;-webkit-border-radius:100px;border-radius:100px;background-color:#9c0;border-color:#f7e5e1;transform:rotate(0);transition:all 0.3s linear 0s;"></div></div><div class="clip2" style="position:absolute;top:0;left:0;width:200px;height:200px;clip:rect(0, 100px, 200px, 0px);box-shadow:0 2px 2px rgba(0,0,0,0.2) inset;border-radius:50%;"><div class="slice2" style="position:absolute;width:200px;height:200px;clip:rect(0px, 200px, 200px, 100px);-moz-border-radius:100px;-webkit-border-radius:100px;border-radius:100px;background-color:#9c0;border-color:#f7e5e1;transform:rotate(0);transition:all 0.3s linear 0.3s;"></div></div><div class="inner" style="border:1px solid #111;position:absolute;height:70%;width:70%;line-height:60px;text-align:center;top:50%;left:50%;margin-top:-39%;margin-left:-35%;background:#1e252f;border-radius:100%;box-shadow:0 8px 15px 10px rgba(0,0,0,0.7);"><div class="status" style="position:absolute;height:30px;width:100%;line-height:60px;text-align:center;top:50%;margin-top:-35px;font-size:16px;font-family:verdana;"></div></div></div></div>');
        $("#escaner").append("<div style='background:#1e252f;width:422px;height:204px;float:right;margin:0 2px;border-left:none;text-align:center;padding:20px 0;'>"+
            "<h1>Escáner de escombros</h1>"+
            "<img style='width:400px;margin:35px 11px;height:100px'>"+
            "<p>Reciclador.: 100 Espacios usados: 5/14</p>"+
        "</div>");
        $("#escaner").append("<table id='tableEscaner' style='padding-top: 30px;margin-left:50px'><thead><tr><th style='padding:5px 50px;'>Posición</th><th>Distancia</th><th>Enviar</th><th style='padding:5px 50px;'>Metal</th><th>Cristal</th></tr><thead></table>");
        progressBarUpdate(0,100);
        recolectarManual();
    }
}

/******************* ÚTILES *********************************************************/
/**
 * Hace que el bot pase a la siguiente acción. Si ya se encuentra en la última pasa al siguiente planeta.
 */
function siguienteAccion() {
    localStorage.accionActual = parseInt(localStorage.accionActual) + 1;
    if(localStorage.accionActual >= acciones.length){
        localStorage.accionActual = 0;
        siguientePlaneta();
    }
    location.reload();
}
/**
 * Hace que el bot pase al siguiente planeta. Si ya se encuentra en el último finaliza la ejecución.
 */
function siguientePlaneta() {
    localStorage.planetaActual = parseInt(localStorage.planetaActual) + 1;
    if(localStorage.planetaActual >= planetas.length){
        localStorage.planetaActual = 0;
        localStorage.pausa = true;
        alert("fin");
    }
    location.reload();
}
/**
 * Cambia de planeta en el juego
 * @param idPlaneta int: clave del planeta (0-10)
 */
function goToPlaneta(idPlaneta){
    window.location = "https://s157-es.ogame.gameforge.com/game/index.php?page=defense&cp="+planetas[idPlaneta]['id'];
}
/**
 * Devuelve el número de naves del tipo solicitado
 * @param tipo string: alias de la nave
 *     -"cg": nave grande de carga
 *     -"cp": nave pequeña de carga
 */
function getNumNaves(tipo) { //TODO
    var id = "ship_203";
    switch (tipo) {
        case "cg":
            id = "ship_203";
            break;
        case "cp":
            id = "ship_202";
            break;
    }
    if($("#" + id).length == 0) return 0;
    return parseInt($("#" + id).attr("onchange").match(/([0-9]+)\)/)[1]);
}
/**
 * Devuelve la clave (0-10) del planeta actual en el juego
 */
function getPlanetaSeleccionado() { //TODO
    var planeta = null;
    $("#myPlanets .smallplanet .planetlink").each(function(key, v){
        if($(this).hasClass("active")){
            planeta = key.toString();
        }
    });
    return planeta;
}
/**
 * Devuelve las coordenadas del planeta fortaleza
 * @return [int, int, int]
 */
function getCoordenadasFortaleza(){ //TODO
     return [3, 204, 5];
}
/**
 * Devuelve las coordenadas del planeta actual
 * @return [int, int, int]
 */
function getCoordenadasPlanetaActual(){ //TODO
     return [3, 204, 5];
}
/**
 * Devuelve el número de flotas disponibles
 * @return int
 */
function getFlotasDisponibles(){ //TODO
    return 1;
}
/**
 * Devuelve el número de expediciones disponibles
 * @return int
 */
function getExpedicionesDisponibles(){ //TODO
    return 1;
}
/**
 * Comprueba si se pueden construir defensas del tipo requerido en el planeta actual
 * @return bool
 */
function sePuedenConstruirDeffs(idDeff){ //TODO
    return $("li.on #"+idDeff).length > 0;
}

/******************* ACCIONES AUTOMÁTICAS *********************************************************/
/**
 * Comprueba si las defensas del planeta son inferiores a las programadas e inicia la contrucción si fueran insuficientes
 */
function hacerDefensas() {
    if (window.location.toString().includes('defense')) {
        if ($("#bestand").length == 0) {
            var deffs;
            if (planetas[localStorage.planetaActual].fortaleza) {
                deffs = defensas.fortaleza;
            } else {
                deffs = defensas.colonia;
            }
            for (var element of deffs) {
                var queremos = element[2];
                var hay = parseInt($("#" + element[1] + " .level").text().replace('.', '').split("\n")[3].trim());
                var contDeffs = queremos - hay;
                if (contDeffs > 0 && sePuedenConstruirDeffs(element[1]) ) {
                    $("#" + element[1]).click();
                    setTimeout(function() {
                        $("#number").val(contDeffs);
                        $(".build-it").click();
                        console.log("haciendo " + element[0]);
                    }, 1500);
                    return false;
                }
            }
        }
        siguienteAccion();

    } else {
        window.location = 'https://s157-es.ogame.gameforge.com/game/index.php?page=defense';
    }
}
/**
 * Envía un cargamento de recursos a la fortaleza
 */
function mandarRecursos() {
    console.log("recursos");
    if (window.location.toString().includes('page=fleet1')) {
        if (getNumNaves("cp") >= 300) {
            $("#ship_202").val("300").change();
            setTimeout(function(){
                $("#continue").click();
            }, 100);
        } else {
            siguienteAccion();
        }

    } else if(window.location.toString().includes('page=fleet2')) {
        $("#galaxy").val(getCoordenadasFortaleza()[0]);
        $("#system").val(getCoordenadasFortaleza()[1]);
        $("#position").val(getCoordenadasFortaleza()[2]);
        $("#continue").click();
    } else if(window.location.toString().includes('page=fleet3')) {
        $("#missionButton3").click();
        maxDeuterium();updateVariables();
        maxCrystal();updateVariables();
        maxMetal();updateVariables();
        $("#start").click();
    } else {
        window.location = 'https://s157-es.ogame.gameforge.com/game/index.php?page=fleet1';
    }
}
/**
 * Envía una expedición de ngc en un sistema próximo aleatorio
 */
function expedicion() {
    console.log("exp");
    if (window.location.toString().includes('page=fleet1')) {
        if (getNumNaves("cg") >= 150 && getExpedicionesDisponibles() > 0 && getFlotasDisponibles() > 0) {
            $("#ship_210").val("1");
            $("#ship_203").val("100").change();
            setTimeout(function(){
                $("#continue").click();
            }, 200);
        } else {
            siguienteAccion();
        }
    } else if(window.location.toString().includes('page=fleet2')) {
        $("#system").val(parseInt(Math.random() * 4 + getCoordenadasPlanetaActual()[1] - 2));
        $("#position").val(16);
        $("#continue").click();
    } else if(window.location.toString().includes('page=fleet3')) {
        $("#start").click();
    } else {
        window.location = 'https://s157-es.ogame.gameforge.com/game/index.php?page=fleet1';
    }

}

function recolectar() {
    console.log("recol");
}

/******************* ACCIONES MANUALES *********************************************************/
var origen = typeof system == "undefined" ? 204 : parseInt(system);
var g = typeof galaxy == "undefined" ? 3 : parseInt(galaxy);
/**
 * Escanea los sistemas circundantes al planeta actual y genera una lista con enlaces para su recolección
 */
function recolectarManual() {
    var resultados = [];
    var rango = 199;
    var repeticiones = 0;
    var interval = setInterval(function() {
        resultados.push(buscarEscombros(g, origen + (rango - 1) / 2 - repeticiones));
        repeticiones++;
        progressBarUpdate(parseInt((repeticiones * 100) / rango),100);
        if (repeticiones >= rango) {
            clearInterval(interval);
            Promise.all(resultados).then(function(resultado) {
                var escombros = [];
                $.each(resultado, function(key, value) {
                    escombros = escombros.concat(value);
                });
                crearLista(escombros);
            });
        }
    }, 150);
}
//Realiza una búsqueda de escombros en el sistema indicado y devuelve los datos necesarios para su recolección
function buscarEscombros(galaxia, sistema) {
    //var promise = {"aaaa":sistema};
    var promise = new Promise(function(resolve, reject) {
        var resultado = null;
        var ruta = 'https://s157-es.ogame.gameforge.com/game/index.php?page=galaxyContent&ajax=1&galaxy=' + galaxia + '&system=' + sistema;

        $.ajax(ruta, {
            async: true,
            data: {
                'galaxy': galaxia,
                'system': sistema
            },
            dataType: "json",
            type: "POST",
            success: function(data) {
                if (data.galaxy) {
                    resolve(interpretarDatos(data.galaxy));
                }
            }
        });
    });
    return promise;

}
//Aplica un regex sobre el html que devuelve el servidor y extrae los datos de los escombros
function interpretarDatos(data) {
    var regex = /(<a href="#" onClick="sendShips\(8,)([0-9])(,)([0-9]+)(,)([0-9]+)(,[0-9]+,)([0-9]+)(\);)/g;
    //var regex = /(<td class="debris js_debris[0-9]+ js_no_action">.)(\s)+(<div id="ownFleetStatus_[0-9]+_2" class="fleetAction)(.){1,73}(>)(.){1,1200}(<a href="#" onClick="sendShips\(8,)([0-9])(,)([0-9]+)(,)([0-9]+)(,[0-9]+,)([0-9]+)(\);)/gm;
    var m = null;
    var resultado = [];
    do {
        m = regex.exec(data);
        if (m) {
            console.log(m);
            var escombro = {
                "galaxia": m[2],
                "sistema": m[4],
                "planeta": m[6],
                "recicladores": m[8]
            };
            resultado.push(escombro);
        }
    } while (m);
    return resultado;
}
//Genera la tabla de resultados del escaner
function crearLista(array) {
    array = array.sort(comparar);
    console.error(array);
    var html = "";
    $.each(array, function(key, escombro) {
        if (parseInt(escombro.recicladores) > 1) {
            html += "<tr style='padding:5px;'>";
            html += '<td><a href="https://s157-es.ogame.gameforge.com/game/index.php?page=galaxy&galaxy=' + escombro.galaxia + '&system=' + escombro.sistema + '&position=' + escombro.planeta + '">' + escombro.galaxia + ':' + escombro.sistema + ':' + escombro.planeta + '</a></td>';
            html += '<td>(' + Math.abs(parseInt(escombro.sistema) - origen) + ')</td>';
            html += "<td><a href='#' onclick='$(this).css(\"text-decoration\",\"line-through\");sendShips(8," + escombro.galaxia + "," + escombro.sistema + "," + escombro.planeta + ",2," + escombro.recicladores + ");return false;'>";
            html += "Reducir (<span style='color:#6f9fc8'>" + escombro.recicladores + "</span>)";
            html += "</a></td>";
            html += "<td>?</td><td>?</td>";
            html += "</tr>";
        }
    });
    $("#tableEscaner").append(html);
}
//Función de comparación. Permite ordenar el array de escombros de menor a mayor distancia al planeta actual
function comparar(a, b) {
    if (Math.abs(parseInt(a.sistema) - origen) < Math.abs(parseInt(b.sistema) - origen))
        return -1;
    if (Math.abs(parseInt(a.sistema) - origen) > Math.abs(parseInt(b.sistema) - origen))
        return 1;
    return 0;
}

/******************* ACCIONES INSTANTÁNEAS *********************************************************/
function accionesInstantaneas() {
    if(localStorage.pausa == "false"){ //solo se hacen de modo manual
        return;
    }
    //escanear galaxia
    if (window.location.href.toString().indexOf("custom=escanear") != -1) {
       // recolectarManual();
    }
    //expedicion1
    if (window.location.href.toString().indexOf("custom=expedicion") != -1) {
        if (getNumNaves("cg") >= 100) {
            $("#ship_210").val("1");
            $("#ship_203").val("100").change();
            $("#continue").click();
        }
    }
    //expedición 2
    if (window.location.href.toString().indexOf("page=fleet2") != -1) {
        if ($("#storage .undermark").html() == "2.500.000") {
            $("#system").val(parseInt(Math.random() * 4 + getCoordenadasPlanetaActual()[1] - 2));
            $("#position").val(16);
            $("#continue").click();
        }
    }
    //expedición 3
    if (window.location.href.toString().indexOf("page=fleet3") != -1) {
        if ($("#maxresources").html() == "2.500.000") {
            $("#start").click();
        }
    }
}
/************* OTRAS FUNCIONES **********************/
/**
 * Funciones para el progressbar
 */
function rotate(element, degree) {
    element.css({
        'transform': 'rotate(' + degree + 'deg)',
        'zoom': 1
    });
}
function getAngle(cx, cy, ex, ey, offset) {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  if (typeof offset != 'undefined')
        theta+=offset;
  if (theta < 0) theta = 360 + theta; // range [0, 360)

    return theta;
}
function progressBarUpdate(x, outOf) {
    var firstHalfAngle = 180;
    var secondHalfAngle = 0;
    var oldAngle = parseInt($(".pie").attr('data-angle'));
    // caluclate the angle
    var drawAngle = x / outOf * 360;

    // calculate the angle to be displayed if each half
    if (drawAngle <= 180) {
        firstHalfAngle = drawAngle;
    } else {
        secondHalfAngle = drawAngle - 180;
    }

    if (drawAngle > 180 && oldAngle < 180){
       $(".slice1, .slice2").css({
        'transition-duration':'0.15s',
        '-webkit-transition-duration':'0.15s'
      });
        $(".slice1").css({
        'transition-delay':'0s',
        '-webkit-transition-delay':'0s'
      });
      $(".slice2").css({
        'transition-delay':'0.15s',
        '-webkit-transition-delay':'0.15s'
      });
    } else if (drawAngle < 180 && oldAngle > 180){
        $(".slice1, .slice2").css({
        'transition-duration':'0.15s',
        '-webkit-transition-duration':'0.15s'
      });
        $(".slice2").css({
        'transition-delay':'0s',
        '-webkit-transition-delay':'0s'
      });
      $(".slice1").css({
        'transition-delay':'0.15s',
        '-webkit-transition-delay':'0.15s'
      });
    } else {
      $(".slice1, .slice2").css({
        'transition-delay':'0s',
        '-webkit-transition-delay':'0s',
        'transition-duration':'0.3s',
        '-webkit-transition-duration':'0.3s'
      });
    }

    $('.pie').attr('data-angle', drawAngle);
    $('.pie').attr('data-x', x);

    // set the transition
    rotate($(".slice1"), firstHalfAngle);
    rotate($(".slice2"), secondHalfAngle);

    // set the values on the text
    $(".status").html(x + "%");
}
/**
 * Convierte a int un string en formato ogame (ej. "1.000.000" -> 1000000)
 */
function toInt(recString){
    return parseInt(recString.replace(/\./g, ""));
}
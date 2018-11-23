// ==UserScript==
// @name         MARVK
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://s157-es.ogame.gameforge.com/*
// @grant        none
// ==/UserScript==

/******************* CONFIGURACIÓN *********************************************************/
const acciones = [
  "defensas",
  "enviarRecursos",
  "reciclar",
  "expedicion"
];

const defensas = {
  "fortaleza": [
    ["Lanzamisiles","details401",507],
    ["Láser pequeño","details402",1174],
    ["Láser grande","details403",40],
    ["Cañón Gauss","details404",10],
    ["Cañón iónico","details405",100],
    ["Cañón de plasma","details406",0],
    ["Cúpula pequeña de protección","details407",0],
    ["Cúpula grande de protección","details408",0],
    ["Misiles antibalísticos","details502",0],
    ["Misil interplanetario","details503",0]
  ],
  "colonia": [
    ["Lanzamisiles","details401",501],
    ["Láser pequeño","details402",1667],
    ["Láser grande","details403",40],
    ["Cañón Gauss","details404",10],
    ["Cañón iónico","details405",100],
    ["Cañón de plasma","details406",0],
    ["Cúpula pequeña de protección","details407",0],
    ["Cúpula grande de protección","details408",0],
    ["Misiles antibalísticos","details502",0],
    ["Misil interplanetario","details503",0]
  ]
}

const planetas = [
  {
    "id": "33638025",
    "fortaleza": true,
    "acciones": [
      true,
      true,
      false,
      false
    ]
  },
  {
    "id": "33639675",
    "fortaleza": false,
    "acciones": [
      true,
      false,
      true,
      true
    ]
  }
];

/******************* MAIN *********************************************************/
$(function(){
    accionesInstantaneas();
    crearMenu();
    /* setTimeout(function() {
      localStorage.pausa = false;
      init();
    }, 600000); */
    init();
});

var localStorage1 = "nope";
if (!localStorage.accActual) {
  localStorage.accActual = 0;
  localStorage.ptActual = 0;
  localStorage.pausa = "true";
}

function init(){
  if(localStorage.pausa === "false"){
    if(getPt() != localStorage.ptActual){ //TODO
      //TODO: goToPlaneta(localStorage.ptActual);
    } else{
      switch(localStorage.accActual){
        case "0":
          hacerDefensas();
          break;
        case "1":
          hacerDefensas();
          break;
        case "2":
          hacerDefensas();
          break;
        case "3":
          hacerDefensas();
          break;
        default:
          localStorage.accActual = 0;
          //TODO: sigPt;
      }
    }
  }
}

/******************* MENU *********************************************************/
function crearMenu(){
    $("#menuTable").prepend("<li id='menuCustom'></li>");
    $("#menuCustom").append(
        '<span id="mandarExpedicion" class="menu_icon custom_menu_icon">'+
            '<a href="https://s157-es.ogame.gameforge.com/game/index.php?page=fleet1&custom=expedicion" class="tooltipRight js_hideTipOnMobile " target="_self" title="Expedición">'+
                '<div class="menuImage fleet1"></div>'+
             '</a>' +
        '</span>'
    );
    $("#menuCustom").append(
        '<span id="recolectar" class="menu_icon custom_menu_icon">'+
            '<a href="https://s157-es.ogame.gameforge.com/game/index.php?page=galaxy&custom=escanear" class="tooltipRight js_hideTipOnMobile " target="_self" title="Recolectar">'+
                '<div class="menuImage alliance"></div>'+
             '</a>' +
        '</span>'
    );
    $("#menuCustom").append(
        '<span id="playPause" class="menu_icon custom_menu_icon">'+
            '<a href="javascript: void(0);" class="tooltipRight js_hideTipOnMobile " target="_self" title="Recolectar">'+
                '<div class="menuImage overview active"></div>'+
             '</a>' +
        '</span>'
    );
    //Estilos
    $(".custom_menu_icon").css("float", "left");
    if(localStorage.pausa == "false"){
        $("#playPause .menuImage").addClass('active');
    } else {
        $("#playPause .menuImage").removeClass('active');
    }
    //Acciones
    $("#playPause").click(function(){
        if(localStorage.pausa == "false"){
           localStorage.pausa = "true";
        } else {
            localStorage.pausa = "false";
        }
        location.reload();
    });


}

/******************* ÚTILES *********************************************************/
function getNumNaves(tipo){
    var id = "ship_203";
    switch(tipo){
        case "cg":
            id = "ship_203";
            break;
    }
    return parseInt($("#"+id).attr("onchange").match(/([0-9]+)\)/)[1]);
}

function getPt(){
  return 0;
}

/******************* ACCIONES AUTOMÁTICAS *********************************************************/
function hacerDefensas(){
  if(window.location.toString().includes('defense')){
    if($("#bestand").length == 0){
      var deffs;
      if (planetas[localStorage.ptActual].fortaleza){
        deffs = defensas.fortaleza;
      } else {
        deffs = defensas.colonia;
      }
      //deffs.forEach(function(element) {
      for(var element of deffs){
        var queremos = element[2];
        var hay = parseInt($("#" + element[1] + " .level").text().replace('.', '').split("\n")[3].trim());
        var contDeffs = queremos - hay;
        if (contDeffs > 0) {
          $("#" + element[1]).click();
          console.log("click en "+element[0]);
          setTimeout(function(){
            $("#number").val(contDeffs);
            $(".build-it").click();
            console.log("haciendo "+element[0]);
          }, 1500);
          return false;
          console.log("return "+element[0]);
        }
      }
    }
    console.log("SIGUIENTE PASO");

  } else {
    window.location = 'https://s157-es.ogame.gameforge.com/game/index.php?page=defense';
  }
}
function mandarRecursos(){
  console.log("recursos");
}
function expedicion(){
    console.log("exp");
}
function recolectar(){
  console.log("recol");
}

/******************* ACCIONES MANUALES *********************************************************/
var origen = 204;
var g = 3;
function recolectarManual(){
    var resultados = [];
    var rango = 201;
    var repeticiones = 0;
    $("#contenedor_escombros").remove();
    $("body").append("<div id='contenedor_escombros' style='position:absolute;top:100px;left:50px;z-index:99999' class='t_ContentContainer t_clearfix t_Content_cloud'>0%</div>");
    var interval = setInterval(function(){
        resultados.push(buscarEscombros(g, origen + (rango-1)/2 - repeticiones));
        repeticiones++;
        $("#contenedor_escombros").html(parseInt((repeticiones*100)/rango)+"%");
        if(repeticiones >= rango){
            clearInterval(interval);
            Promise.all(resultados).then(function(resultado) {
                var escombros = [];
                $.each(resultado, function(key, value){
                    escombros = escombros.concat(value);
                });
                crearLista(escombros);
            });
        }
    }, 100);
}

function buscarEscombros(galaxia, sistema){
    //var promise = {"aaaa":sistema};
    var promise = new Promise(function(resolve, reject) {
        var resultado = null;
        var ruta = 'https://s157-es.ogame.gameforge.com/game/index.php?page=galaxyContent&ajax=1&galaxy='+galaxia+'&system='+sistema;

        $.ajax(ruta, {
            async: true,
            data: {
                'galaxy': galaxia,
                'system': sistema
            },
            dataType: "json",
            type: "POST",
            success: function(data) {
                if(data.galaxy){
                    resolve(interpretarDatos(data.galaxy));
                }
            }
        });
    });
    return promise;

}

function interpretarDatos(data){
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

function crearLista(array){
    array = array.sort(comparar);
    console.error(array);
    var html = "<ul>";
    $.each(array, function(key, escombro){
        if(parseInt(escombro.recicladores) > 1){
            html += "<li>";
            html += '<a href="https://s157-es.ogame.gameforge.com/game/index.php?page=galaxy&galaxy='+escombro.galaxia+'&system='+escombro.sistema+'&position='+escombro.planeta+'">'+escombro.galaxia+':'+escombro.sistema+':'+escombro.planeta+'</a> ('+Math.abs(parseInt(escombro.sistema)-origen)+') - ';
            html += "<a href='#' onclick='$(this).css(\"text-decoration\",\"line-through\");sendShips(8,"+escombro.galaxia+","+escombro.sistema+","+escombro.planeta+",2,"+escombro.recicladores+");return false;'>";
            html += "Reducir ("+escombro.recicladores+")";
            html += "</a></li>";
        }
    });
    html += "</ul>";
    $("#contenedor_escombros").html(html);
}

function comparar(a, b){
    if (Math.abs(parseInt(a.sistema) - origen)  < Math.abs(parseInt(b.sistema) - origen))
        return -1;
    if (Math.abs(parseInt(a.sistema) - origen)  > Math.abs(parseInt(b.sistema) - origen))
        return 1;
    return 0;
}

/******************* ACCIONES INSTANTÁNEAS *********************************************************/
function accionesInstantaneas(){
    //escanear galaxia
    if(window.location.href.toString().indexOf("custom=escanear") != -1){
        recolectarManual();
    }
    //expedicion1
    if(window.location.href.toString().indexOf("custom=expedicion") != -1){
        if(getNumNaves("cg") >= 50){
            $("#ship_210").val("1");
            $("#ship_203").val("50").change();
            $("#continue").click();
        }
    }
    //expedición 2
    if(window.location.href.toString().indexOf("page=fleet2") != -1){
        if($("#storage .undermark").html() == "1.250.000"){
            $("#system").val(parseInt(Math.random() * (206 - 202) + 202));
            $("#position").val(16);
            $("#continue").click();
        }
    }
    //expedición 3
    if(window.location.href.toString().indexOf("page=fleet3") != -1){
        if($("#maxresources").html() == "1.250.000"){
            $("#start").click();
        }
    }
}

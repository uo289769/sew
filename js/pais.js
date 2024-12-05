"use strict";

class Pais {

    constructor(nombre, capital, poblacion) {
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;

        this.apikey = "&appid=9443d7ec0358760511995862b9a4b4d6";
        this.idioma = "&lang=es";
        this.unidades = "&units=metric";
        this.url = "http://api.openweathermap.org/data/2.5/forecast?lat=";
    }

    rellenarParametros(circuito, formaGobierno, 
            longitudMeta, latitudMeta, altitudMeta, religion) {
        this.circuito = circuito;
        this.formaGobierno = formaGobierno;
        this.longitudMeta = longitudMeta;
        this.latitudMeta = latitudMeta;
        this.altitudMeta = altitudMeta;
        this.religion = religion;

        this.url = this.url + this.latitudMeta + "&lon=" + this.longitudMeta + this.apikey + "&mode=xml" + this.unidades;
    }

    getNombre() {
        return this.nombre;
    }

    getCapital() {
        return this.capital;
    }

    getInformacionSecundaria() {
        return "<ul> <li>Circuito: " + this.circuito + "</li> " +
                "<li>Población: " + this.poblacion + " habitantes</li> " + 
                "<li>Forma de gobierno: " + this.formaGobierno + "</li> " +
                "<li>Religión mayoritaria: " + this.religion + "</li> </ul>";
    }

    escribirCoordenadasMeta() {
        document.write("<p>Longitud: " + this.longitudMeta + "</p> <p>Latitud: " + this.latitudMeta +
            "</p> <p>Altitud: " + this.altitudMeta + "</p>"
        );
    }

    obtenerDatosMeteorologicos() {
        const ciudad = this.capital;
        $.ajax({
            dataType: "xml",
            url: this.url,
            method: 'GET',
            success: function(datos){

                var newSection = $("<section></section>");
                var newH3 = $("<h3></h3>").text("Pronóstico meteorológico en " + ciudad + " para los próximos 5 días");
                newSection.append(newH3);
                
                $(datos).find("time").each(function(index) {
                    var prediccionPorDia = $(this);
                    var fechaHora = new Date(prediccionPorDia.attr("from") || prediccionPorDia.attr("day"));
                    console.log(fechaHora);

                    if (fechaHora.getHours() === 15) {
                        var newArticle = $("<article></article>");
                        
                        var fecha                 = fechaHora.toLocaleDateString("es-ES");
                        var hora                  = fechaHora.toLocaleTimeString("es-ES");
                        var temperaturaMin        = $('temperature', prediccionPorDia).attr("min");
                        var temperaturaMax        = $('temperature', prediccionPorDia).attr("max");
                        var humedad               = $('humidity', prediccionPorDia).attr("value");
                        var humedadUnit           = $('humidity', prediccionPorDia).attr("unit");
                        var precipitacionValue    = $('precipitation', prediccionPorDia).attr("value");
                        var iconoId               = $('symbol', prediccionPorDia).attr("var");
                        var icono                 = "https://openweathermap.org/img/w/" + iconoId + ".png";
                        
                        var newH4 = $("<h4></h4>").text(fecha + " a las " + hora);
                        newArticle.append(newH4);

                        var newImg = $("<img></img>");
                        newImg.attr("src", icono);
                        newImg.attr("alt", "Icono representativo del tiempo del día");
                        newArticle.append(newImg);
                        
                        var newUl = $("<ul></ul>");
                        var tempMin = $("<li></li>").text("Temperatura mínima: " + temperaturaMin + " ºC");
                        var tempMax = $("<li></li>").text("Temperatura máxima: " + temperaturaMax + " ºC");
                        var humedadVar = $("<li></li>").text("Humedad: " + humedad + " " + humedadUnit);
                        var precipitacion = $("<li></li>").text("Precipitación: " + (precipitacionValue || "0") + " mm");

                        newUl.append(tempMin);
                        newUl.append(tempMax);
                        newUl.append(humedadVar);
                        newUl.append(precipitacion);

                        newArticle.append(newUl);
                        newSection.append(newArticle);
                    }
                    
                });

                    $("main").append(newSection);
                },
            error:function() {
                $("h3").html("¡Tenemos problemas! No puedo obtener XML de <a href='http://openweathermap.org'>OpenWeatherMap</a>"); 
            }
        });
    }
}

var pais = new Pais("Singapur", "Singapur", "5.677.000");
pais.rellenarParametros("Marina Bay", "República parlamentaria de partido hegemónico",
    "103.86416549383493", "1.2916970048725602", "4,15 m", "Budismo");
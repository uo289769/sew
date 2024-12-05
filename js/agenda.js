"use strict";

class Agenda {
    constructor() {
        this.url = "https://ergast.com/api/f1/current.json";
        this.ultimaConsulta = null;
        this.cache = null;
    }

    obtenerDatosConsulta() {
        const horaActual = new Date().getTime();

        if (this.cache && this.ultimaConsulta) {
            const diferencia = horaActual - this.ultimaConsulta;

            // si diferencia < 5 minutos -> se muestran los datos de la última consulta
            if (diferencia < 300000) {
                this.procesarDatosAHTML(this.cache);
            }
            else {
                this.ejecutarConsulta();
            }
        }
        else {
            this.ejecutarConsulta();
        }
    }

    ejecutarConsulta() {
        $.ajax({
            dataType: "json",
            url: this.url,
            method: 'GET',
            success: function(datos) {
                this.ultimaConsulta = new Date().getTime();
                this.cache = datos;
                this.procesarDatosAHTML(datos);
                
            }.bind(this),
            error:function() {
                $("h2").html("¡Tenemos problemas! No se pudo obtener JSON"); 
            }
        });
    }

    procesarDatosAHTML(datos) {
        const carreras = datos.MRData.RaceTable.Races;
        const temporada = datos.MRData.RaceTable.season;
        const newSection = $("<section></section>");
        const newH3 = $("<h3></h3>").text("Temporada " + temporada);
        newSection.append(newH3);

        const main = document.querySelectorAll("main")[0];
        const oldSection = document.querySelectorAll("section")[0];

        if (oldSection) {
            main.removeChild(oldSection);
        }

        carreras.forEach(function(carrera) {
            
            const nombreCarrera = carrera.raceName;
            const circuito = carrera.Circuit.circuitName;
            const latitud = carrera.Circuit.Location.lat;
            const longitud = carrera.Circuit.Location.long;
            const fechaHora = carrera.date + " " + (carrera.time || "Hora no especificada");

            const newH4 = $("<h4></h4>").text(nombreCarrera);

            var newUl = $("<ul></ul>");
            var circuitoLi = $("<li></li>").text("Circuito: " + circuito);
            var fechaHoraLi = $("<li></li>").text("Fecha y hora: " + fechaHora);
            var coordenadasLi = $("<li></li>").text("Coordenadas: " + latitud + ", " + longitud);

            newUl.append(circuitoLi);
            newUl.append(fechaHoraLi);
            newUl.append(coordenadasLi);
            
            const newArticle = $("<article></article>");
            newArticle.append(newH4);
            newArticle.append(newUl);

            newSection.append(newArticle);
        });
        
        $("main").append(newSection);
    }
}
"use strict";

class Viajes {

    constructor() {
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));

        this.mapaDinamico = false;
    }

    getPosicion(posicion) {
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed;
        
        if (typeof this.latitud === 'number' && typeof this.longitud === 'number') {
            console.log("Latitud y longitud están definidas y son válidas.");
            
            // Comprobar si el mapa dinámico está creado
            if (!this.mapaDinamico) {
                this.getMapaDinamicoGoogle();
            }
        } else {
            console.log("Error: Latitud o longitud no están definidas o no son válidas.");
        }
    }

    verErrores(error) {
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        }
    }

    getLongitud() {
        return this.longitud;
    }

    getLatitud() {
        return this.latitud;
    }

    getAltitud() {
        return this.altitud;
    }

    getMapaEstaticoGoogle() {
        var seccionAnterior = document.querySelectorAll("section")[2];
        if (seccionAnterior) {
            return;
        }
        var seccion = document.createElement("section");

        var h3 = document.createElement("h3");
        h3.textContent = "Mapa estático";
        seccion.appendChild(h3);

        var main = document.querySelectorAll("main")[0];
        main.appendChild(seccion);
        var ubicacion = seccion;
        
        var apiKey = "&key=AIzaSyCtf2xjmAL1sm0Sn4X6N6UfYJQdDuCFWDE";
        var url = "https://maps.googleapis.com/maps/api/staticmap?";
        //Parametros
        // centro del mapa (obligatorio si no hay marcadores)
        var centro = "center=" + this.latitud + "," + this.longitud;
        //zoom (obligatorio si no hay marcadores)
        //zoom: 1 (el mundo), 5 (continentes), 10 (ciudad), 15 (calles), 20 (edificios)
        var zoom = "&zoom=15";
        //Tamaño del mapa en pixeles (obligatorio)
        var tamano = "&size=800x600";
        //marcadores (opcional)
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
        //rutas. path (opcional)
        //visible (optional)
        //style (opcional)
        var sensor = "&sensor=false"; 
        
        this.imagenMapa = url + centro + zoom + tamano + marcador + sensor + apiKey;

        var img = document.createElement("img");
        img.src = this.imagenMapa;
        img.alt = "mapa estático google";
        ubicacion.appendChild(img);
    }

    getMapaDinamicoGoogle() {
        var centro = {lat: this.latitud, lng: this.longitud};
        const mapaGeoposicionado = new google.maps.Map(document.querySelectorAll('div')[0], {
            zoom: 10,
            center: centro,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
        new google.maps.Marker({
            position: centro,
            map: mapaGeoposicionado,
            title: "Ubicación actual"
        });

        var infoWindow = new google.maps.InfoWindow;
        infoWindow.setPosition(centro);
        infoWindow.setContent('Localización encontrada');
        infoWindow.open(mapaGeoposicionado);
    }

    handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                                'Error: Ha fallado la geolocalización' :
                                'Error: Su navegador no soporta geolocalización');
        infoWindow.open(mapaGeoposicionado);
    }
}

function initMap() {
    const viajes = new Viajes();

    document.querySelectorAll("input")[0].addEventListener("click", function() {
        viajes.getMapaEstaticoGoogle();
    });

    document.querySelectorAll("article")[0].addEventListener("load", function() {
        viajes.iniciarCarrusel();
    });
}

function iniciarCarrusel() {
    const slides = document.querySelectorAll("img");

    const nextSlide = document.querySelector("article > button:nth-of-type(2)");

    let curSlide = 3;
    let maxSlide = slides.length - 1;

    // add event listener and navigation functionality
    nextSlide.addEventListener("click", function () {
        if (curSlide === maxSlide) {
            curSlide = 0;
        } else {
            curSlide++;
        }

        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)');
        });
    });

    const prevSlide = document.querySelector("article > button:nth-of-type(1)");

    prevSlide.addEventListener("click", function () {
        if (curSlide === 0) {
            curSlide = maxSlide;
        } else {
            curSlide--;
        }

        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)');
        });
    });
}
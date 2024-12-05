"use strict";

class Fondo {

    constructor(pais, capital, circuito) {
        this.pais = pais;
        this.capital = capital;
        this.circuito = circuito;
    }

    obtenerImagenCircuito() {
        var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

        $.getJSON(flickrAPI, 
                {
                    tags: this.circuito + ", f1",
                    tagmode: "all",
                    format: "json"
                })
            .done(function(data) {
                $("body").css("background-image", "url(" + data.items[0].media.m.replace("_m", "_b") + ")");
        });
    }
}
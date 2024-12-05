"use strict";

class Circuito {
    
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) 
            document.write("<p>Este navegador soporta el API File</p>");
        else 
            document.write("<p>¡¡¡ Este navegador NO soporta el API File y el programa puede no funcionar correctamente !!!</p>");
    }

    leerVariosArchivos(files) {
        // 2 elementos a procesar: circuitoEsquema.xml y circuito.kml
        var nArchivos = files.length;
        var nombre = document.querySelectorAll("p")[2];

        for (var i=0; i < nArchivos; i++) {
            var archivo = files[i];
            if (archivo.name.endsWith(".kml")) {
                var lector = new FileReader();
                lector.onload = function (evento) {
                    this.procesarKml(evento.target.result);
                }.bind(this);
                lector.readAsText(archivo);
            } else if (archivo.name.endsWith(".xml")) {
                nombre.innerText = "Nombre del archivo: " + archivo.name;
                
                var lector = new FileReader();
                lector.onload = function (evento) {
                    this.procesarXml(evento.target.result);
                }.bind(this);
                lector.readAsText(archivo);
            }
        }
    }

    procesarKml(archivoKml) {
        const newH4 = $("<h4></h4>").text("Mapa del circuito");
        $("div").before(newH4);

        const parser = new DOMParser();
        const kml = parser.parseFromString(archivoKml, "application/xml");

        const coordenadas = kml.querySelector("coordinates").textContent.trim();
        const puntos = coordenadas.split("\n").map(coord => {
            const [lng, lat] = coord.split(",").map(Number);
            return {
                lat: lat,
                lng: lng
            };
        });

        const map = new google.maps.Map(document.querySelectorAll('div')[0], {
            center: puntos[0],
            zoom: 15,
            mapTypeId: 'terrain'
        });

        const line = new google.maps.Polyline({
            path: puntos,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 4,
        });
    
        line.setMap(map);
    }

    procesarXml(archivoXml) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(archivoXml, "application/xml");

        var circuito = xml.getElementsByTagName("circuito")[0];
        var nombre = circuito.getElementsByTagName("nombre")[0].textContent;
        var largura = circuito.getElementsByTagName("largura")[0].textContent + " " +
                    circuito.getElementsByTagName("largura")[0].getAttribute("unidades");
        var anchura = circuito.getElementsByTagName("anchura")[0].textContent + " " +
                    circuito.getElementsByTagName("anchura")[0].getAttribute("unidades");
        var fechaYHora = circuito.getElementsByTagName("fecha")[0].textContent + " " +
                    circuito.getElementsByTagName("hora")[0].textContent;
        var vueltas = circuito.getElementsByTagName("vueltas")[0].textContent;
        var localidad = circuito.getElementsByTagName("localidad")[0].textContent;
        var pais = circuito.getElementsByTagName("pais")[0].textContent;

        // Referencias
        var ref = circuito.getElementsByTagName("referencia");
        var referencias = [];

        for (let i=0; i < ref.length; i++) {
            referencias.push(ref[i].textContent);
        }

        // Fotos
        var ft = circuito.getElementsByTagName("foto");
        var fotos = [];

        for (let i=0; i < ft.length; i++) {
            fotos.push(ft[i].textContent);
        }

        // Videos
        var vd = circuito.getElementsByTagName("video");
        var videos = [];

        for (let i=0; i < vd.length; i++) {
            videos.push(vd[i].textContent);
        }

        // Puntos
        var pts = circuito.getElementsByTagName("punto");
        var puntos = [];

        for (let i=0; i < pts.length; i++) {
            var punto = pts[i];
            var longitud = punto.getElementsByTagName("longitud")[0].textContent;
            var latitud = punto.getElementsByTagName("latitud")[0].textContent;
            var altitud = punto.getElementsByTagName("altitud")[0].textContent;
            var sector = punto.getElementsByTagName("sector")[0].textContent;
            var distancia = punto.getElementsByTagName("distancia")[0].textContent + " " +
                        punto.getElementsByTagName("distancia")[0].getAttribute("unidades");

            puntos.push({longitud, latitud, altitud, sector, distancia});
        }
        
        this.toHtml(nombre, largura, anchura, fechaYHora, vueltas, localidad, pais, referencias, fotos, videos, puntos);
    }

    toHtml(nombre, largura, anchura, fechaYHora, vueltas, localidad, pais, referencias, fotos, videos, puntos) {
        const newH4 = $("<h4></h4>").text(nombre);

        var newUl = $("<ul></ul>");
        var circuitoLi = $("<li></li>").text("Localidad: " + localidad + ", " + pais);
        var fechaHoraLi = $("<li></li>").text("Fecha y hora: " + fechaYHora);
        var larguraLi = $("<li></li>").text("Largura: " + largura);
        var anchuraLi = $("<li></li>").text("Anchura: " + anchura);
        var vueltasLi = $("<li></li>").text("Nº vueltas: " + vueltas);
        var referenciasLi = $("<li></li>").text("Referencias: ");

        // Referencias
        var newOl = $("<ol></ol>");
        for (let i=0; i < referencias.length; i++) {
            var newA = $("<a></a>").text(referencias[i]);
            newA.attr("href", referencias[i]);
            newA.attr("title", "enlace a pagina sobre el circuito");

            var newRefLi = $("<li></li>");

            newRefLi.append(newA);
            newOl.append(newRefLi);
        }
        referenciasLi.append(newOl);

        newUl.append(circuitoLi);
        newUl.append(fechaHoraLi);
        newUl.append(larguraLi);
        newUl.append(anchuraLi);
        newUl.append(vueltasLi);
        newUl.append(referenciasLi);
        
        $("section:nth-of-type(2)").append(newUl);

        // Imagenes
        var newPicture = $("<picture></picture>");
        for (let i=0; i < fotos.length; i++) {
            var nombreFoto = fotos[i].split('.')[0];
            var rutaFoto = "xml/" + nombreFoto;

            var newSource1 = $("<source></source>");
            newSource1.attr("media", "(max-width: 465px)");
            newSource1.attr("srcset", rutaFoto + "-s.jpeg");
            
            var newSource2 = $("<source></source>");
            newSource2.attr("media", "(max-width: 799px)");
            newSource2.attr("srcset", rutaFoto + "-m.jpeg");
            
            var newSource3 = $("<source></source>");
            newSource3.attr("media", "(min-width: 800px)");
            newSource3.attr("srcset", rutaFoto + "-l.jpeg");

            
            var newImg = $("<img>");
            newImg.attr("src", "xml/" + fotos[i]);
            newImg.attr("alt", "foto del circuito");

            newPicture.append(newSource1);
            newPicture.append(newSource2);
            newPicture.append(newSource3);
            newPicture.append(newImg);
        }

        $("section:nth-of-type(2)").append(newPicture);
    }

    leerArchivoSvg(files) {
        var archivo = files[0];
        if (archivo.name.endsWith(".svg")) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                var newSection = $("<section></section>");
                newSection.attr("data-state", "svg");
                var newH4 = $("<h4></h4>").text("Perfil del circuito");
                
                var newFigure = $("<figure></figure>");
                newFigure.attr("data-state", "svg");
                var newFigCaption = $("<figcaption></figcaption>").text("Perfil del circuito");
                var newSvg = $(evento.target.result);
                
                newSvg.attr({
                    "width": "100%",
                    "height": "100%",
                    "preserveAspectRatio": "xMidYMid meet"
                });

                newFigure.append(newSvg);
                newFigure.append(newFigCaption);

                newSection.append(newH4);
                newSection.append(newFigure);
                $("main").append(newSection);
            };
            lector.readAsText(archivo);
        }
        else {
            errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
        }
    }

    leerArchivoTexto(files) { 
        //Solamente toma un archivo
        var archivo = files[0];
        var nombre = document.querySelectorAll("p")[2];
        var tamaño = document.querySelectorAll("p")[3];
        var tipo = document.querySelectorAll("p")[4];
        var ultima = document.querySelectorAll("p")[5];
        var contenido = document.querySelectorAll("p")[6];
        var areaVisualizacion = document.querySelectorAll("pre")[0];
        var errorArchivo = document.querySelectorAll("p")[7];
        nombre.innerText = "Nombre del archivo: " + archivo.name;
        tamaño.innerText = "Tamaño del archivo: " + archivo.size + " bytes"; 
        tipo.innerText = "Tipo del archivo: " + archivo.type;
        ultima.innerText = "Fecha de la última modificación: " + archivo.lastModifiedDate;
        contenido.innerText = "Contenido del archivo de texto:";
        
        var tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
                //La propiedad "result" es donde se almacena el contenido del archivo
                areaVisualizacion.innerText = lector.result;
            }
            lector.readAsText(archivo);
        }
        else {
            errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
        }
    }
}
"use strict";

class Api {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) 
            document.write("<p>Este navegador soporta el API File</p>");
        else 
            document.write("<p>¡¡¡ Este navegador NO soporta el API File y el programa puede no funcionar correctamente !!!</p>");
    }

    readInputFile(files) {
        var archivo = files[0];
        var tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                var result = lector.result;
                var lineas = result.split("\n");

                var newSection = $("<section></section>");
                var newH4 = $("<h4></h4>").text("Entrevistas a pilotos");
                newSection.append(newH4);

                /*
                for (let i=0; i < lineas.length; i++) {
                    var linea = lineas[i].split(",");

                    var newArticle = $("<article></article>");
                    
                    var newH5 = $("<h5></h5>").text(linea[0]);
                    newArticle.append(newH5);

                    var newButton = $("<button></button>").text("Reproducir");
                    newArticle.append(newButton);

                    var newImg = $("<img>");
                    newImg.attr("src", linea[1]);
                    newImg.attr("alt", "logo equipo de " + linea[0]);
                    newArticle.append(newImg);

                    newSection.append(newArticle);
                }*/

                const table = $('<table>');
                const caption = $('<caption>').text('Pilotos');
                const thead = $('<thead>');
                const tbody = $('<tbody>');

                const headerRow = $('<tr>');
                headerRow.append('<th scope="col" id="piloto">Piloto</th>');
                headerRow.append('<th scope="col" id="logo">Logo equipo</th>');
                headerRow.append('<th scope="col" id="entrevista">Entrevista</th>');
                thead.append(headerRow);

                for (let i=0; i < lineas.length; i++) {
                    var linea = lineas[i].split(",");

                    var newImg = $("<img>");
                    newImg.attr("src", linea[1]);
                    newImg.attr("alt", "logo equipo de " + linea[0]);

                    const row = $('<tr>');
                    row.append('<th scope="row" id="' +linea[0].replace(/ /g, "")+ '" headers="piloto">'+linea[0]+'</th>');

                    const logoCell = $('<td headers="'+ linea[0].replace(/ /g, "") + ' logo">');
                    logoCell.append(newImg);
                    row.append(logoCell);

                    const buttonCell = $('<td>');
                    /*
                    const button = $('<button>');
                    button.attr("text", "Reproducir");
                    button.attr("data-audio", "../multimedia/audios/" + linea[0].replace(/ /g, "%20") + ".mp3");
                    button.on("click", function () {
                        playAudio($(this).data("audio"));
                    });
                    buttonCell.append(button);
                    */

                    /*
                    const newAudio = $("<audio controls></audio>");
                    const newSource = $("<source>");
                    newSource.attr("src", "multimedia/audios/" + linea[0].replace(/ /g, "%20") + ".mp3");
                    newSource.attr("type", "audio/mp3");
                    newAudio.append(newSource);*/

                    const newButton = $("<button></button>");
                    newButton.attr("text", "Reproducir");
                    newButton.attr("data-audio", "multimedia/audios/" + linea[0].replace(/ /g, "%20") + ".mp3");

                    newButton.on("click", function () {
                        const audioFile = $(this).data("audio");
                        playAudio(audioFile);
                    });

                    buttonCell.append(newButton);
                    row.append(buttonCell);
                    tbody.append(row);
    
                    table.append(caption);
                    table.append(thead);
                    table.append(tbody);
                }

                newSection.append(table);

                $("main").append(newSection);
            }
            lector.readAsText(archivo);
        }
        else {
            errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
        }  
    }
}

function playAudio(audioFile) {
    const audioContext = new AudioContext();

    fetch(audioFile)
    fetch(audioFile)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start(0);
        })
        .catch((error) => console.error("Error al cargar el audio:", error));
}
"use strict";

class Noticias {

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

                for (let i=0; i < lineas.length; i++) {
                    var parametrosPorLinea = lineas[i].split("_");
                    
                    var titular = parametrosPorLinea[0];
                    var entradilla = parametrosPorLinea[1];
                    var autor = parametrosPorLinea[2];

                    var newArticle = $("<article></article>");
                    
                    var newH4 = $("<h4></h4>").text(titular);
                    newArticle.append(newH4);

                    var newPre = $("<pre></pre>").text(entradilla);
                    newArticle.append(newPre);
                    
                    var newP = $("<p></p>").text(autor);
                    newArticle.append(newP);

                    $("section:first-of-type").append(newArticle);
                }
            }
            lector.readAsText(archivo);
        }
        else {
            errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
        }  
    }

    crearNoticia() {
        var titular = document.querySelectorAll("input")[1];
        var entradilla = document.querySelectorAll("input")[2];
        var autor = document.querySelectorAll("input")[3];

        if (titular.value === "" || titular.value === " ") {
            titular.value = "(--Titular por defecto--)";
        }
        if (entradilla.value === "" || entradilla.value === " ") {
            entradilla.value = "(--Entradilla por defecto--)";
        }
        if (autor.value === "" || autor.value === " ") {
            autor.value = "(--Autor--)";
        }

        var newArticle = document.createElement("article");
        
        var newH4 = document.createElement("h4");
        newH4.textContent = titular.value;
        newArticle.appendChild(newH4);

        var newPre = document.createElement("pre")
        newPre.textContent = entradilla.value;
        newArticle.appendChild(newPre);
        
        var newP = document.createElement("article");
        newP.textContent = autor.value;
        newArticle.appendChild(newP);

        document.querySelectorAll("section")[2].appendChild(newArticle);

        titular.value = "";
        entradilla.value = "";
        autor.value = "";
    }
}
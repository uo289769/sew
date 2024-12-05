"use strict";

class Semaforo {

    constructor() {
        this.levels = [0.2, 0.5, 0.8];
        this.lights = 4;
        this.unload_moment = null;
        this.clic_moment = null;

        var indiceAleatorio = Math.floor(Math.random() * this.levels.length);
        this.difficulty = this.levels[indiceAleatorio];

        this.createStructure();
    }

    createStructure() {
        const main = document.querySelectorAll("main")[0];

        const newH2 = document.createElement("h2");
        newH2.textContent = "Semáforo";
        main.appendChild(newH2);

        for (let i=0; i < this.lights; i++) {
            const newDiv = document.createElement("div");
            main.appendChild(newDiv);
        }

        const buttonArranque = document.createElement("button");
        const buttonReaccion = document.createElement("button");

        buttonArranque.textContent = "Arranque";
        buttonReaccion.textContent = "Reacción";

        buttonArranque.onclick = this.initSequence.bind(this);
        buttonReaccion.onclick = this.stopReaction.bind(this);
        buttonReaccion.disabled = true;

        main.appendChild(buttonArranque);
        main.appendChild(buttonReaccion);
    }

    initSequence() {
        const main = document.querySelectorAll("main")[0];
        main.classList.add("load");

        const buttonArranque = document.querySelectorAll("button")[0];
        buttonArranque.disabled = true;

        const delay = (this.difficulty * 100) + 2000;

        setTimeout(() => {
            this.unload_moment = new Date();
            this.endSequence();
        }, delay);
    }

    endSequence() {
        const buttonReaccion = document.querySelectorAll("button")[1];
        buttonReaccion.disabled = false;

        const main = document.querySelectorAll("main")[0];
        main.classList.add("unload");
    }

    stopReaction() {
        const main = document.querySelectorAll("main")[0];
        const oldP = document.querySelectorAll("p")[1];

        if (oldP) {
            main.removeChild(oldP);
        }

        this.clic_moment = new Date();
        var tiempoReaccion = this.clic_moment - this.unload_moment;

        tiempoReaccion = Number((tiempoReaccion / 1000).toFixed(3));

        const newP = document.createElement("p");
        newP.textContent = "Tu tiempo de reacción es: " + tiempoReaccion + " s";
        main.appendChild(newP);

        main.classList.remove("load", "unload");

        const buttonReaccion = document.querySelectorAll("button")[1];
        buttonReaccion.disabled = true;

        const buttonArranque = document.querySelectorAll("button")[0];
        buttonArranque.disabled = false;

        this.createRecordForm(tiempoReaccion);
    }

    createRecordForm(tiempoReaccion) {
        const newForm = `<form method='post' action='#' name="datos">
                        <label>
                        Nombre:
                        <input type="text" name="nombre" placeholder="Escriba su nombre">
                        </label>
                        <label>
                        Apellidos:
                        <input type="text" name="apellidos" placeholder="Escriba sus apellidos">
                        </label>
                        <label>
                        Nivel:
                        <input type="text" name="nivel" value="${this.difficulty}" readonly>
                        </label>
                        <label>
                        Tiempo de reacción (s):
                        <input type="text" name="tiempo" value="${tiempoReaccion}" readonly>
                        </label>
                        <button type="submit">Enviar</button>
                    </form>
                    `;
        $("main").append(newForm);
    }
}
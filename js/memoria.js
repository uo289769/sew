"use strict";

class Memoria {

    constructor() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
        
        this.elements = {
            "tarjetas" : [
                {
                    element : "RedBull",
                    source : "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"
                },
                {
                    element : "RedBull",
                    source : "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"
                },
                {
                    element : "McLaren",
                    source : "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"
                },
                {
                    element : "McLaren",
                    source : "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"
                },
                {
                    element : "Alpine",
                    source : "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"
                },
                {
                    element : "Alpine",
                    source : "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"
                },
                {
                    element : "AstonMartin",
                    source : "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"
                },
                {
                    element : "AstonMartin",
                    source : "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"
                },
                {
                    element : "Ferrari",
                    source : "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"
                },
                {
                    element : "Ferrari",
                    source : "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"
                },
                {
                    element : "Mercedes",
                    source : "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
                },
                {
                    element : "Mercedes",
                    source : "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
                }
            ]
        }

        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }
    
    /*Utilizo el algoritmo de Durstenfeld*/
    shuffleElements() {
        let az = 0;
        for (let i=this.elements["tarjetas"].length-1; i > 0; i--) {
            az = Math.floor(Math.random() * (i+1));
            let tmp = this.elements["tarjetas"][az];
            this.elements["tarjetas"][az] = this.elements["tarjetas"][i];
            this.elements["tarjetas"][i] = tmp;
        }
    }

    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.dataset.state = "hidden";
            this.secondCard.dataset.state = "hidden";
            
            this.resetBoard();
        }, 1000);

    }

    resetBoard() {
        this.firstCard = null;
        this.secondCard = null;

        this.hasFlippedCard = false;
        this.lockBoard = false;
    }

    checkForMatch() {
        (this.firstCard.dataset.element === this.secondCard.dataset.element) ? this.disableCards() : this.unflipCards();
    }

    disableCards() {
        this.firstCard.dataset.state = "revealed";
        this.secondCard.dataset.state = "revealed";

        this.resetBoard();
    }

    createElements() {
        const section = document.querySelectorAll("section")[1];

        for (let i=0; i < this.elements["tarjetas"].length; i++) {
            const newArticle = document.createElement("article");
            const newH3 = document.createElement("h3");
            const newImg = document.createElement("img");

            newArticle.setAttribute("data-element", this.elements["tarjetas"][i].element);
            newH3.textContent = "Tarjeta de memoria";
            newImg.setAttribute("src", this.elements["tarjetas"][i].source);
            newImg.setAttribute("alt", this.elements["tarjetas"][i].element);

            newArticle.appendChild(newH3);
            newArticle.appendChild(newImg);

            section.appendChild(newArticle);
        }
    }

    flipCard(game) {
        if (this.dataset.state === "revealed" || game.lockBoard || this === game.firstCard) {
            return;
        }
        this.dataset.state = "flip";

        if (game.hasFlippedCard) {
            game.secondCard = this;
            game.checkForMatch();
        } else {
            game.hasFlippedCard = true;
            game.firstCard = this;
        }
    }

    addEventListeners() {
        const tarjetas = document.querySelectorAll("article");

        for (let i=0; i < tarjetas.length; i++) {
            tarjetas[i].onclick = this.flipCard.bind(tarjetas[i], this);
        }
    }
}
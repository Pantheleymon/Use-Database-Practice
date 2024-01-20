"use strict";

document.addEventListener('DOMContentLoaded', ()=>{

    const addNewCardForm = document.querySelector('.menu__form');

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src,
            this.alt = alt,
            this.title = title,
            this.descr = descr,
            this.price = price,
            this.parent = document.querySelector(parentSelector),
            this.classes = classes;
            this.transfer = 80;
            this.changeToRub();
        }

        changeToRub() {
            this.price = this.price * this.transfer
        }

        render() {
            let element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            `;

            this.parent.append(element);
        }
    };

    const urlCardsDB = 'db.json';

    function generateCardsFromDB(url) {
        fetch(url)
        .then(response => response.json())
        .then(json => {
            document.querySelector(".menu .container").innerHTML = "";
            json.menu.forEach((item) => {
                new MenuCard(item.img, item.altimg, item.title, item.descr, item.price, ".menu .container").render();
            })
        })
        .catch( () => {
            console.error('Ошибка доступа к базе данных');
        });
    };

    generateCardsFromDB(urlCardsDB);

    function appendNewCardsToDB(url, form) {
        let data = new FormData(form);
        // console.log(JSON.stringify(Object.fromEntries(data)));

        fetch(url, {
            method: "POST",
            body: JSON.stringify(Object.fromEntries(data)),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(generateCardsFromDB(urlCardsDB))
        .catch( () => {
            console.error('Ошибка доступа к базе данных');
        });
    };

    addNewCardForm.querySelector('button').addEventListener('click', (el) => {
        el.preventDefault();
        appendNewCardsToDB(urlCardsDB, addNewCardForm)
    })

})
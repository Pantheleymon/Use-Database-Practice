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
            this.price = +this.price * this.transfer
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

    const urlCardsDB = 'http://localhost:3000/menu';

    const generateCardsFromDB = (url) => {
        fetch(url)
        .then(data => data.json())
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
            });
        })
        .catch( () => {
            console.error('Ошибка доступа к базе данных');
        });
    };

    generateCardsFromDB(urlCardsDB);

    const appendNewCardsToDB = async (url, form) => {
        let formData = new FormData(form);

        await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
        .then(data => data.json())
        .then(data => {
            new MenuCard(data.img, data.altimg, data.title, data.descr, data.price, ".menu .container").render();
        })
        .catch( () => {
            console.error('Ошибка доступа к базе данных');
        });
    };

    addNewCardForm.addEventListener('submit', (el) => {
        el.preventDefault();
        appendNewCardsToDB(urlCardsDB, addNewCardForm)
    })

})
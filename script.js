"use strict";

document.addEventListener('DOMContentLoaded', ()=>{

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

    setTimeout(()=>{
        let req = new XMLHttpRequest();

        req.open('GET', 'db.json');
        req.setRequestHeader('Content-type', 'application/json');
        req.send();

        req.addEventListener('readystatechange', ()=>{
            if (req.status === 200 && req.readyState == 4) {
                const data = JSON.parse(req.response);
                data.menu.forEach( (item) => {
                    new MenuCard(item.img, item.altimg, item.title, item.descr, item.price, ".menu .container").render();
                })
            }
        })
    }, 0)
})
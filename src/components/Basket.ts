import {Component} from "../components/base/Component";
import {createElement, ensureElement} from "../utils/utils";
import {IBasketView} from "../types";
import {EventEmitter} from "../components/base/Events";

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _price: HTMLSpanElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLUListElement>('.basket__list', this.container);
        this._price = ensureElement<HTMLSpanElement>('.basket__price', this.container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        if (this._button)
            this._button.addEventListener('click', () => {
                events.emit('address:open');
            })
    };

    // отображение товаров в корзине
    set items(items: HTMLElement[]) {
        if (items.length)
            this._list.replaceChildren(...items)
        else
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }))
    }

    //блокировка кнопки
    disableButton(value: boolean) {
        this._button.disabled = value;
    }

    // отображение цены в корзине
    set price(price: number) {
        this.setText(this._price, `${price} синапсов`)
    }
}
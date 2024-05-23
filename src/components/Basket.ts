import {Component} from './base/Component';
import {EventEmitter} from './base/Events';
import {IBasket} from '../types';
import {createElement, ensureElement} from "../utils/utils";

/**
 * Класс для работы с корзиной, наследуется от класса Component (реализация слоя View).
 * Класс используется для управления отображением данных (товаров, цены) в компоненте корзины
 */
export class Basket extends Component<IBasket> {
    protected list: HTMLElement;
    protected total: HTMLElement | null;
    protected button: HTMLButtonElement | null;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.list = ensureElement<HTMLElement>('.basket__list', this.container);
        this.total = this.container.querySelector('.basket__price');
        this.button = this.container.querySelector('.basket__button');

        if (this.button) {
            this.button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
        this.items = [];
    }

    //установка списка товаров
    set items(items: HTMLElement[]) {
        if (items.length) {
            this.list.replaceChildren(...items);
        }
        else {
            this.list.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'В корзине пусто',
                })
            );
        }
    }

    //установка цены
    set price(value: number) {
        this.setText(this.total, `${value} синапсов`);
    }

    //блокировка кнопки
    disableButton(value: boolean) {
        this.button.disabled = value;
    }
}
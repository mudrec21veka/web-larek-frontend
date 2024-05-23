import {Component} from './base/Component';
import {IPage} from '../types';
import {IEvents} from './base/Events';
import {ensureElement} from "../utils/utils";

/**
 * Класс для управления элементами главной страницы, наследуется от класса Component (реализация слоя View).
 * Класс используется для управления состоянием страницы и отображением товаров на странице
 */

export class Page extends Component<IPage> {
    protected catalog: HTMLElement;
    protected wrapper: HTMLElement;
    protected basket: HTMLElement;
    protected count: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.catalog = ensureElement<HTMLElement>('.gallery');
        this.wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this.basket = ensureElement<HTMLElement>('.header__basket');
        this.count = ensureElement<HTMLElement>('.header__basket-counter');

        this.basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    //установка списка товаров на странице
    set list(items: HTMLElement[]) {
        this.catalog.replaceChildren(...items);
    }

    //установка блокировки на странице
    set blocked(value: boolean) {
		if (value) {
			this.toggleClass(this.wrapper, 'page__wrapper_locked', true);
		} else {
			this.toggleClass(this.wrapper, 'page__wrapper_locked', false);
		}
    }
}
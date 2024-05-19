import {Component} from "./base/Component";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean
};

export class Page extends Component<IPage> {
    protected _counter: HTMLSpanElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLDivElement;
    protected _basket: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = ensureElement<HTMLSpanElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLDivElement>('.page__wrapper');
        this._basket = ensureElement<HTMLButtonElement>('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open')
        })
    };

    // устанавливливает каталог на странице
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items)
    };

    // устанавливливает счетчик на корзине
    set counter(value: number) {
        this.setText(this._counter, value)
    };

    // блокирует страницу
    set locked(value: boolean) {
        if (value)
            this._wrapper.classList.add('page__wrapper_locked')
        else
            this._wrapper.classList.remove('page__wrapper_locked')
    }
}
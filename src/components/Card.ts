import {Component} from './base/Component';
import {Category, ICard, ICardAction} from "../types";
import {ensureElement} from "../utils/utils";

const CategoryTypes: Record<string, string> = {
    'софт-скил': 'soft',
    'другое': 'other',
    'дополнительное': 'additional',
    'хард-скил': 'hard',
};

/**
 * Класс для управления отображением информации о продукте, наследуется от класса Component (реализация слоя View).
 * Класс используется для управления отображением данных (название, картинка) в компоненте карточки товара
 */
export class Card extends Component<ICard> {
    protected cardTitle: HTMLElement;
    protected cardImage?: HTMLImageElement;
    protected text?: HTMLElement | null;
    protected cardCategory?: HTMLElement | null;
    protected button?: HTMLButtonElement | null;
    protected cardPrice: HTMLElement | null;

    constructor(container: HTMLElement, actions?: ICardAction) {
        super(container);

        this.cardTitle = ensureElement<HTMLElement>(`.card__title`, container);
        this.cardImage = container.querySelector(`.card__image`);
        this.text = container.querySelector(`.card__text`);
        this.cardPrice = container.querySelector(`.card__price`);
        this.cardCategory = container.querySelector(`.card__category`);
        this.button = container.querySelector(`.card__button`);

        if (actions?.onClick) {
            if (this.button) {
                this.button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    //установка текста в карточку
    set title(value: string) {
        this.setText(this.cardTitle, value);
    }

    //получение текста в карточке
    get title(): string {
        return this.cardTitle.textContent || '';
    }

    //установка изображения в карточку
    set image(value: string) {
        this.setImage(this.cardImage, value, this.title);
    }

    //установка описания в карточку
    set description(value: string) {
        this.setText(this.text, value);
    }

    //получение описания в карточке
    get description(): string {
        return this.text.textContent || '';
    }

    //установка категории товара
    set category(value: Category) {
        this.setText(this.cardCategory, value);
        const categoryClass = CategoryTypes[value];
        this.toggleClass(this.cardCategory, `card__category_${categoryClass}`, true);
    }

    //установка цены товара
    set price(value: number | null) {
        if (value !== null) {
            this.setText(this.cardPrice, `${value} синапсов`);
            if (this.button) {
                this.setDisabled(this.button, false);
            }
        } else {
            this.setText(this.cardPrice, 'Бесценно');
            if (this.button) {
                this.setDisabled(this.button, true);
            }
        }
    }

    //установка выбранности товара
    set selected(value: boolean) {
        if (!this.button.disabled) {
            this.setDisabled(this.button, value);
        }
    }
}
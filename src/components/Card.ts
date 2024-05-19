import {Component} from "./base/Component";
import {IProduct} from "../types";
import {ensureElement} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

const TCategory: Record<string, string> = {
    'софт-скил': 'soft',
    'другое': 'other',
    'дополнительное': 'additional',
    'кнопка': 'button',
    'хард-скил': 'hard'
};

export class Card extends Component<IProduct> {
    protected _title: HTMLHeadingElement;
    protected _image?: HTMLImageElement;
    protected _text?: HTMLParagraphElement;
    protected _category?: HTMLSpanElement;
    protected _price: HTMLSpanElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLHeadingElement>('.card__title', container);
        this._image = container.querySelector('.card__image');
        this._text = container.querySelector('.card__text');
        this._category = container.querySelector('.card__category');
        this._price = container.querySelector('.card__price');
        this._button = container.querySelector('.card__button');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick)
            } else {
                container.addEventListener('click', actions.onClick)
            }
        }
    };

    // Установка текста в карточку
    set title(value: string) {
        this.setText(this._title, value)
    };

    // Установка изображения в карточку
    set image(value: string) {
        this.setImage(this._image, value, this.title)
    };

    // Установка описания в карточку
    set text(value: string) {
        this.setText(this._text, value)
    };

    // Устанавливает категорию товара
    set category(value: string) {
        this.setText(this._category, value);
        this._category.classList.add(`card__category_${TCategory[value]}`);
    }

    // Устанавливает цену товара
    set price(value: number | null) {
		this.setText(this._price,
			value ? `${value.toString()} синапсов` : 'Бесценно'
		);
		if (value === null && this._button) {
			this._button.disabled = true;
			this.setText(this._button, 'Нельзя купить');
		}
    };

    // Возвращает цену товара
    get price(): number {
		return Number(this._price.textContent) || 0;
	};

    // Устанавливает текст кнопки
    set button(value: string) {
		this.setText(this._button, value);
	};

    // Устанавливает статус товара
	set selected(value: boolean) {
		this.toggleButton(value);
	};

    // Метод для изменения кнопки
	toggleButton(selected: boolean) {
		!selected?
        this.button = 'В корзину' : this.button = 'Убрать из корзины';
	}
}
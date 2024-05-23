import {IOrderSuccess, ISuccessActions} from "../types";
import {Component} from './base/Component';
import {ensureElement} from "../utils/utils";

/**
 * Класс для работы с окном успешного оформления заказа, наследуется от класса Component (реализация слоя View).
 * Класс используется для управления отображением данных (стоимость товара) в компоненте модального окна успешного оформления заказа
 */
export class SuccessForm extends Component<IOrderSuccess> {
    protected orderCount: HTMLElement;
    protected close: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ISuccessActions) {
        super(container);

        this.orderCount = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (actions?.onClick) {
            if (this.close) {
                this.close.addEventListener('click', actions.onClick);
            }
            else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    //установка количества списанных синапсов
    set count(value: string) {
        this.setText(this.orderCount, `Списано ${value} синапсов`);
    }
}
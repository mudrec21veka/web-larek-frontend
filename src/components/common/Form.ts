import {Component} from "../base/Component";
import {IEvents} from "../base/Events";
import {IForm} from "../../types";
import {ensureElement} from "../../utils/utils";

/**
 * Класс для работы с формами, наследуется от класса Component (реализация слоя View).
 * Класс используется для установки значения валидности и передачу ошибок в компонент, а также для отображения компонента (render) формы заполнения данных
 */
export class Form<T> extends Component<IForm> {
    protected submit: HTMLButtonElement;
    protected formErrors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    // изменение поля в заказе
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`order:change`, {
            field,
            value,
        });
    }

    // установка значения валидности
    set valid(value: boolean) {
        this.submit.disabled = !value;
    }

    // передача ошибок в форме
    set errors(value: string) {
        this.setText(this.formErrors, value);
    }

    // отображение формы
    render(state: Partial<T> & IForm) {
        const { valid, errors, ...inputs } = state;
        super.render({ valid, errors });
        Object.assign(this, inputs);

        return this.container;
    }
}
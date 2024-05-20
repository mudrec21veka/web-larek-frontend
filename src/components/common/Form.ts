import {Component} from "../base/Component";
import {IEvents} from "../base/events";
import {IFormState} from "../../types";
import {ensureElement} from "../../utils/utils";

export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value)
        });

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`)
        })
    };

    // изменение поля в заказе
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`order:change`, {
            field,
            value
        })
    };

    //установка значения валидности
    set valid(value: boolean) {
        this._submit.disabled = !value
    };

    //передача ошибок в форме
    set errors(value: string) {
        this.setText(this._errors, value)
    };

    //отображение формы
    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container
    }
}
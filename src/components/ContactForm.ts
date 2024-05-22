import {IContactForm } from '../types';
import {IEvents} from './base/events';
import {Form} from "./common/Form";

/**
 * Класс для управления отображением формы Контакты, наследуется от класса Form (реализация слоя View).
 * Класс используется для управления отображением данных (телефон, почта) в компоненте формы заполнения данных пользователя
 */

export class ContactForm extends Form<IContactForm> {

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)
    };

    //установка номера телефона
    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    };
    
    //установка почты
    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}
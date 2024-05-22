import {Model} from './base/model';
import {FormErrors, IAppData, IOrder, IOrderForm, IProduct} from "../types";
import {Product} from "./Product";

/**
 * Класс для управления состоянием приложения, т.е. для хранения данных (реализация слоя Model), наследуется от класса Model.
 * Класс получает, передает, хранит и удаляет данные, которые используются Presenter'ом (данные приходят и отправляются в Presenter).
 * Например, в Presenter (index.ts) вызывается экземпляр класса AppData и происходит передача данных, например товара (Product) используя метод (add) класса AppData
 */
export class AppData extends Model<IAppData> {
    catalog: IProduct[];
    basket: IProduct[] = [];
    order: IOrder = {
        address: '',
        payment: null,
        email: '',
        phone: '',
        items: [],
        total: null,
    };
    formErrors: FormErrors = {};

    // получение списка товаров
    setCatalog(items: IProduct[]) {
        this.catalog = items.map((item) => new Product(item, this.events));
        this.emitChanges('items:render', { catalog: this.catalog });
    }

    // добавление товара в корзину
    add(item: Product) {
        this.basket.push(item);
    }

    //удаление товара из корзины
    remove(id: string) {
        this.basket = this.basket.filter((item) => item.id !== id);
        this.setCustomerData();
    }

    // получение значения подсчета количества товаров
    get count() {
        return this.basket.length;
    }

    //получение итоговой суммы заказа в корзине
    get totalPrice() {
        return this.basket.reduce((a, c) => a + c.price, 0);
    }

    // добавление данных покупателя
    setCustomerData() {
        this.order.items = this.basket.map((item) => item.id);
    }

    //очистка корзины
    resetBasket() {
        this.basket = [];
    }

    // установка полей заказа
    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateContacts()) {
            this.events.emit('contacts:ready', this.order);
        }

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    // валидация формы заполнения Email и телефона
    validateContacts() {
        const errors: typeof this.formErrors = {};

        if (!this.order.email) {
            errors.email = 'Укажите ваш Email';
        }

        if (!this.order.phone) {
            errors.phone = 'Укажите ваш телефон';
        }
        this.formErrors = errors;
        this.events.emit('contactsErrors:change', this.formErrors);

        return Object.keys(errors).length === 0;
    }

    // валидация формы заполнения способа оплаты и адрес доставки
    validateOrder() {
        const errors: typeof this.formErrors = {};

        if (!this.order.payment) {
            errors.payment = 'Укажите способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Укажите адрес доставки';
        }
        this.formErrors = errors;
        this.events.emit('orderErrors:change', this.formErrors);

        return Object.keys(errors).length === 0;
    }

    // очистка данных покупателя
    resetOrder() {
        this.order = {
            items: [],
            total: 0,
            address: '',
            email: '',
            phone: '',
            payment: '',
        };
    }
}
import {Model} from "./base/Model";
import {TFormErrors, IAppState, IProduct, IOrder, IValidForm, IBacketCard} from "../types";

export class AppState extends Model<IAppState> {
    catalog: IProduct[];
    basket: IBacketCard[] = [];
    order: IOrder = this.getEmptyOrder();
    formErrors: TFormErrors = {};

    // установка каталога
    setCatalog(items: IProduct[]) {
        this.catalog = items;
        this.emitChanges('items:changed');
    };

    // шаблон для установки пустых значений
    getEmptyOrder(): IOrder {
        return {
            payment: '',
            address: '',
            email: '',
            phone: '',
            items: [],
            total: 0
        }
    };

    // добавить товар в корзиину
    add(item: IProduct) {
        this.basket.push(item)
    };

    // удалить товар из корзины
    remove(id: string) {
        this.basket = this.basket.filter(item => item.id !== id)
    };

    // возвращает кол-во продуктов в корзине
    get count() {
        return this.basket.length
    };

    // возвращает сумму корзины
    get total() {
        return this.basket.reduce((total, item) => total + item.price, 0);
    };

    // выбранные товары
    selected() {
		this.order.items = this.basket.map((item) => item.id);
    };

    // установка данных покупателя
    setDataOrder(field: keyof IValidForm, value: string) {
        this.order[field] = value;

        if (!this.validateAddress())
			return

		if (!this.validateContacts())
			return
    };

    // очистка корзины
    resetBasket() {
        this.basket = []
    };

    // очистка данных покупателя
    resetDataOrder() {
        this.order = this.getEmptyOrder()
    };

    // сброс счетчика
    resetCount() {
        return this.basket.length = 0
    };

    // очистка выбранных продуктов
    resetSelected() {
		this.catalog.forEach(items => {
			items.selected = false;
		});
	};

    // валидация формы адреса
    validateAddress() {
        const errors: typeof this.formErrors = {};

        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты'
        };

        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес'
        };

        this.formErrors = errors;
        this.events.emit('addressErrors:change', this.formErrors);

        return Object.keys(errors).length === 0;
    };

    // валидация формы контактов
    validateContacts() {
        const errors: typeof this.formErrors = {};

        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }

        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        this.formErrors = errors;
        this.events.emit('contactsErrors:change', this.formErrors);

        return Object.keys(errors).length === 0;
    }
}
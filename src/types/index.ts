export type Category =  'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

// Интерфейс данных приложения
export interface IAppData {
    catalog: IProduct[]; //список товаров
    basket: IProduct[]; //информация из корзины
    order: IOrder | null; //информация для заказа
};

// Интерфейс главной страницы
export interface IPage {
    list: HTMLElement[]; //список товаров
};

// Интерфейс товара
export interface IProduct {
    id: string; //id товара
    category: Category; //категория товара
    title: string; //наименование товара
    description: string; //описание товара
    image: string; //изображение товара
    price: number | null; //цена товара
    selected?: boolean; //выбран ли товар
};

// Интерфейс карточки товара
export interface ICard extends IProduct {
    selected: boolean; //в корзине ли товар
    index?: number;
};

// Интерфейс модального окна для оформления доставки
export interface IDeliverForm {
    address: string; //адрес доставки
    payment: string; //способ оплаты
};

// Интерфейс модального окна Контакты
export interface IContactForm {
    email: string; //email
    phone: string; //телефон
};

// Интерфейс корзины
export interface IBasket {
    items: HTMLElement[]; //список товаров
    price: number; //стоимость заказа
};

// Интерфейс заказа
export interface IOrder extends IDeliverForm, IContactForm {
    items: string[]; //список id товаров
    total: number; //общая сумма заказа
};

// Интерфейс формы заказа
export interface IOrderForm extends IDeliverForm, IContactForm {};

// Интерфейс валидации формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс успешное оформление заказа
export interface IOrderSuccess {
    id: string; //id заказа
    count: number; //количество списанных синапсов
};

// Интерфейс действий окна успешного оформления заказа
export interface ISuccessActions {
    onClick: () => void; //по клику
};

// Интерфейс модального окна
export interface IModal {
    //содержимое
    content: HTMLElement;
};

// Интерфейс окна формы
export interface IForm {
    valid: boolean; //валидность формы
    errors: string[]; //ошибки в форме
};

// Интерфейс действий над карточкой
export interface ICardAction {
    onClick: (event: MouseEvent) => void; //по клику
};
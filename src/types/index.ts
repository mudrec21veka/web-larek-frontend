export type Category = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

// Интерфейс данных приложения
export interface IAppState {
    catalog: IProduct[];  //список товаров
    basket: IProduct[];  //информация из корзины
    order: IOrder | null;  //информация для заказа
    formErrors: TFormErrors;
    setCatalog(items: IProduct[]): void;
    add(card: IProduct): void;
    remove(id: string): void;
    setDataOrder(field: keyof IValidForm, value: string): void
};

// Интерфейс товара
export interface IProduct {
    id: string;  //id товара              
    description: string;  //описание товара
    image: string;  //изображение товара
    title: string;  //наименование товара
    category: Category;  //категория товара
    price: number | null;  //цена товара
    selected?: boolean;  //выбран ли товар
};

// Интерфейс модального окна для оформления доставки
export interface IAddressForm {
    payment: string;  //способ оплаты
    address: string;  //адрес доставки
};

// Интерфейс модального окна Контакты
export interface IСontactsForm {
    email: string;  //email
    phone: string;  //телефон
};

// Интерфейс валидации форм
export type IValidForm = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;

// Интерфейс заказа
export interface IOrder extends IAddressForm, IСontactsForm {
    items: string[];  //список id товаров
    total: number;  //общая сумма заказа
};

// Интерфейс окна формы
export interface IFormState {
    valid: boolean;  //валидность формы
    errors: string[];  //ошибки в форме
};

// Интерфейс корзины
export interface IBasketView {
    items: HTMLElement[];
    total: number;
};

// Товар в корзине
export type IBacketCard = Pick<IProduct, 'id' | 'title' | 'price'>;

// Ошибка в форме
export type TFormErrors = Partial<Record<keyof IOrder, string>>;
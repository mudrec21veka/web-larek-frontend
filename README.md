# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка
```
npm run build
```

или

```
yarn build
```

## Реализация

Данное приложение было реализовано с помощью архитектуры MVP:
- Model - модель данных;
- View - модель отображения интерфейса;
- Presenter - связующая модель;

## Описание

### Типы данных
```TypeScript
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
```

### Базовые классы

- Класс **Api** отвечает за взаимодействие с сервером.
**Методы:**
    - `get(uri: string)` - отправляет GET запросы на сервер;
    - `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - отправляет POST запросы на сервер.

- Абстрактный класс **Component** отвечает за взаимодействие с DOM.
**Методы:**
    - `toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключает класс;
    - `setText(element: HTMLElement, value: unknown)` - устанавливает текстовое содержимое;
    - `setDisabled(element: HTMLElement, state: boolean)` - меняет статус блокировки;
    - `setHidden(element: HTMLElement)` - скрывает элемент;
    - `setVisible(element: HTMLElement)` - показывает элемент;
    - `setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает изображение с альтернативным текстом;
    - `render(data?: Partial<T>): HTMLElement` - возвращает корневой DOM-элемент.

- Класс **EventEmitter** отвечает за работу событий. Класс основан на паттерне Observer, который позволяет создать зависимость между объектами-наблюдателями и одним объектом-источником. При изменении состояния источника все наблюдатели автоматически об этом оповещаются.
**Методы:**
    - `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - устанавливает обработчик на событие;
    - `off(eventName: EventName, callback: Subscriber)` - снимает обработчик с события;
    - `emit<T extends object>(eventName: string, data?: T)` - инициирует событие с данными;
    - `onAll(callback: (event: EmitterEvent) => void)` - слушает все события;
    - `offAll()` - сбрасывает все события;
    - `trigger<T extends object>(eventName: string, context?: Partial<T>)` - делает коллбек триггер, генерирующий событие при вызове.

- Абстрактный класс **Model** отвечает за работу с данными.
**Методы:**
    - `emitChanges(event: string, payload?: object)` - сообщает всем, что модель поменялась.

### Слой данных (Model)
- Класс **AppState** отвечает за управление данными.
**Методы:**
    - `setCatalog(items: IProduct[])` - возвращает список товаров;
    - `add(item: IProduct)` - добавляет товар в корзину;
    - `remove(id: string)` - удаляет товар из корзины;
    - `get count()` - возвращает кол-во товаров в корзине;
    - `get total()` - возвращает общую стоимость товаров в корзине;
    - `selected()` - устанавливает выбранные товары в заказе;
    - `setDataOrder(field: keyof IValidForm, value: string)` - устанавливает данные о покупателе;
    - `resetBasket()` - очищает корзину;
    - `resetDataOrder()` - удаляет данные о покупателе;
    - `resetCount()` - сбрасывает счетчик корзины;
    - `resetSelected()` - сбрасывает выбранные товары в заказе;
    - `validateAddress()` - валидация формы адреса;
    - `validateContacts()` - валидация формы контактов.

### Слой Presenter
- Класс **WebLarekAPI** управляет данными между слоем данных (Model) и слоем представления (View).
**Методы:**
    - `getProduct(id: string): Promise<IProduct>` - возвращает товар;
    - `getProductList(): Promise<IProduct[]>` - возвращает список товаров.

### Слой представления (View)
- Класс **Page** отвечает за отображение данных на странице.
**Методы:**
    - `set counter(value: number)` - устанавливает счетчик товаров;
    - `set catalog(items: HTMLElement[])` - устанавливает каталог товаров;
    - `set locked(value: boolean)` - устанавливает блокировку.

- Класс **Card** отвечает за отображение карточек на странице.
**Методы:**
    - `set title(value: string)` - устанавливает название товара;
    - `set image(value: string)` - устанавливает картинку;
    - `set text(value: string)` - устанавливает описание;
    - `set category(value: string)` - устанавливает категорию;
    - `set price(value: number | null)` - устанавливает цену;
    - `get price()` - возвращает цену;
    - `set button(value: string)` - устанавливает текст кнопки;
    - `set selected(value: boolean)` - устанавливает статус товара (выбран или нет).

- Класс **Basket** отвечает за отображение данных в корзине.
**Методы:**
    - `set items(items: HTMLElement[])` - устанавливает добавленные товары;
    - `set price(price: number)` - устанавливает общую сумму корзины;
    - `disableButton(value: boolean)` - блокирует кнопку.

- Класс **Form** отвечает за установку контента в формах и его валидацию.
**Методы:**
    - `onInputChange(field: keyof T, value: string)` - изменяет значение в поле;
    - `set valid(value: boolean)` - отображает валидность;
    - `set errors(value: string)` - устанавливает ошибку;
    - `render(state: Partial<T> & IFormState)` - отображает форму.

- Класс **Success** отвечает за отображение суммы списанных средств в окне успешного заказа.
**Методы:**
    - `set total(total: number)` - устанавливает сумму списанных средств.

- Класс **Modal** отвечает за работу модальных окон.
**Методы:**
    - `set content(value: HTMLElement)` - устанавливает контент;
    - `open()` - открывает модальное окно;
    - `close()` - закрывает модальное окно;
    - `render(data: IModalData)` - отображает модальное окно.

- Класс **Address** отвечает за форму с выбором способа оплаты и адреса доставки.
**Методы:**
    - `set address(value: string)` - устанавливает адрес доставки.

- Класс **Contacts** отвечает за форму с указанием телефона и почты покупателя.
**Методы:**
    - `set phone(value: string)` - устанавливает номер телефона;
    - `set email(value: string)` - устанавливает почту.

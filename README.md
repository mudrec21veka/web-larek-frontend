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
- src/scss/styles.scss — корневой файл стилей
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

Данное приложение было реализовано с помощью архитектуры MVP(Model-View-Presenter):
- слой данных (Model) - классы: AppState + WebLarekAPI (слой коммуникации);
- слой отображения (View) - классы компонентов: Basket, Form, Modal, Success, Card, Contacts, Adress, Page;
- слой представления (Presenter) - соединение Model и View через навешивания событий в файле index.ts (связующая модель);

## Архитектура проекта
В проекте используются данные (товара, покупателя) собираемые в объекты данных, которые передается в компоненты (карточка товара, формы данных покупателя) и в коллекции этих объектов.


### Описание базовых классов:
- **Класс EventEmitter** обеспечивает работу событий. Его функции: установить и снять слушателей событий, вызвать слушателей при возникновении события. 
Использован паттерн «Observer», который позволяет подписаться и уведомлять о событиях.
  #### Методы:
  - on(eventName: EventName, callback: (event: T) => void) - установить обработчик на событие
  - off(eventName: EventName, callback: Subscriber) - снять обработчик с события
  - emit(eventName: string, data?: T) - инициировать событие с данными
  - onAll(callback: (event: EmitterEvent) => void) - слушать все события
  - offAll() - сбросить все обработчики
  - trigger(eventName: string, context?: Partial<T>) - сделать коллбек триггер, генерирующий событие при вызове


- **Класс Api** обеспечивает взаимодействие с сервером. Его функции: выполнить get и post запросы для получения списка продуктов и конкретного продукта.
    #### Методы:
  - get(uri: string) - выполняет get запрос на сервер
  - post(uri: string, data: object, method: ApiPostMethods) - выполняет post запрос на сервер


- **Класс Component** обеспечивает методами для работы с DOM. Его функции: устанавливать данные в компонентах, а также отрисовывать их
    #### Методы:
  - toggleClass(element: HTMLElement, className: string, force?: boolean) - переключить класс
  - setText(element: HTMLElement, value: string) - установить текстовое содержимое
  - setDisabled(element: HTMLElement, state: boolean) - сменить статус блокировки
  - setHidden(element: HTMLElement) - скрыть компонент
  - setVisible(element: HTMLElement) - показать компонент
  - setImage(element: HTMLImageElement, src: string, alt?: string) - установить изображение с альтернативным текстом
  - render(data?: Partial<T>) - вернуть корневой DOM-элемент


- **Класс Model** - абстрактный класс для слоя данных. Его функции: получить данные и события, чтобы уведомлять что данные поменялись
    #### Методы:
  - emitChanges(event: string, payload?: object) - сообщить всем что модель поменялась


### Слой данных
- **Класс AppState** - Класс для управления состоянием приложения, т.е. для хранения данных (реализация слоя Model), наследуется от класса Model. Класс получает, передает, хранит и удаляет данные, которые используются Presenter'ом (данные приходят и отправляются в Presenter).
```TypeScript
export class AppState extends Model<IAppState> {
    // установка каталога
    setCatalog(items: IProduct[]): void

    // добавить товар в корзиину
    add(item: IProduct): void

    // удалить товар из корзины
    remove(id: string): void

    // возвращает кол-во продуктов в корзине
    get count(): void

    // возвращает сумму корзины
    get total(): void

    // выбранные товары
    selected(): void

    // установка данных покупателя
    setDataOrder(field: keyof IValidForm, value: string): void

    // очистка корзины
    resetBasket(): void

    // очистка данных покупателя
    resetDataOrder(): void

    // сброс счетчика
    resetCount(): void

    // очистка выбранных продуктов
    resetSelected(): void

    // валидация формы адреса
    validateAddress(): void

    // валидация формы контактов
    validateContacts(): void
```

### Слой коммуникаций
- **Класс WebLarekAPI** - Класс для взаимодействия с сервером, наследуется от класса Api (реализация слоя Model). Методы класса используются для получения данных с сервера и предоставления данных в Presenter для отображения в компонентах (View)
```TypeScript
export class WebLarekAPI extends Api implements IWebLarekAPI {
    //API_ORIGIN
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit)

    //поулчить товар
    getProduct(id: string): Promise<IProduct>

    //получить список товаров
    getProductList(): Promise<IProduct[]>
}
```

### Типы данных
```TypeScript
// Интерфейс данных приложения
export interface IAppState {
    catalog: IProduct[];  //список товаров
    basket: IProduct[];  //информация из корзины
    order: IOrder | null;  //информация для заказа
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

### Слой представления
#### Общие компоненты
- **Класс Basket** - Класс для работы с корзиной, наследуется от класса Component (реализация слоя View). Класс используется для управления отображением данных (товаров, цены) в компоненте корзины.
```TypeScript
class Basket extends Component<IBasketView> {
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
    }

    // отображение товаров в корзине
    set items(items: HTMLElement[]): void

    //блокировка кнопки
    disableButton(value: boolean): void

    // отображение цены в корзине
    set price(price: number): void
}
```
- **Класс Form** - Класс для работы с формами, наследуется от класса Component (реализация слоя View). Класс используется для установки значения валидности и передачу ошибок в компонент, а также для отображения компонента (render) формы заполнения данных
```TypeScript
class Form<T> extends Component<IFormState> {
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
}

    // изменение поля в заказе
    protected onInputChange(field: keyof T, value: string): void

    //установка значения валидности
    set valid(value: boolean): void

     //передача ошибок в форме
    set errors(value: string): void

    //отображение формы
    render(state: Partial<T> & IFormState): void
}
```
- **Класс Modal** - Класс для работы с модальными окнами, наследуется от класса Component (реализация слоя View). Класс используется для управления состоянием (открыт, закрыт) и отображением компонента (render) модального окна.
```TypeScript
class Modal extends Component<IModalData> {
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
    }

    // установить контент в модалке
    set content(value: HTMLElement): void

    // открыть модалку
    open(): void

    // закрыть модалку
    close(): void

    render(data: IModalData): HTMLElement
}
```
- **Класс Success** - Класс для работы с окном успешного оформления заказа, наследуется от класса Component (реализация слоя View). Класс используется для управления отображением данных (стоимость товара) в компоненте модального окна успешного оформления заказа
```TypeScript
class Success extends Component<ISuccess> {
    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);
    }

    //установка количества списанных синапсов
    set total(total: number): void
}
```

#### Компоненты предметной области
- **Класс Card** - Класс для управления отображением информации о продукте, наследуется от класса Component (реализация слоя View). Класс используется для управления отображением данных (название, картинка) в компоненте карточки товара
```TypeScript
class Card extends Component<IProduct> {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
    }

    // Установка текста в карточку
    set title(value: string): void

    // Установка изображения в карточку
    set image(value: string): void

    // Установка описания в карточку
    set text(value: string): void

    // Устанавливает категорию товара
    set category(value: string): void

    // Устанавливает цену товара
    set price(value: number | null): void

    // Возвращает цену товара
    get price(): number

    // Устанавливает текст кнопки
    set button(value: string): void

    // Устанавливает статус товара
	set selected(value: boolean): void

}
```
- **Класс Contacts** - Класс для управления отображением формы Контакты, наследуется от класса Form (реализация слоя View). Класс используется для управления отображением данных (телефон, почта) в компоненте формы заполнения данных пользователя
```TypeScript
class Contacts extends Form<IСontactsForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)
    }

    //установка номера телефона
    set phone(value: string): void
    
    //установка почты
    set email(value: string): void
}
```
- **Класс Address** - Класс для управления отображением формы оформления доставки, наследуется от класса Form (реализация слоя View). Класс используется для управления отображением данных (адрес) в компоненте формы заполнения данных пользователя
```TypeScript
class Address extends Form<IAddressForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    //установка адреса заказа
    set address(value: string): void
}
```
- **Класс Page** - Класс для управления элементами главной страницы, наследуется от класса Component (реализация слоя View). Класс используется для управления состоянием страницы и отображением товаров на странице
```TypeScript
class Page extends Component<IPage> {
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
    }

    // устанавливливает каталог на странице
    set catalog(items: HTMLElement[]): void

    // устанавливливает счетчик на корзине
    set counter(value: number): void

    // установка блокировки на странице
    set locked(value: boolean): void
}
```

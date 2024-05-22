import './scss/styles.scss';

import {WebLarekAPI} from './components/WebLarekAPI';
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/Events";
import {AppState} from './components/AppState';
import {Page} from "./components/Page";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/Basket";
import {Card} from './components/Card';
import {Address} from './components/Address';
import {Contacts} from './components/Contacts';
import {Success} from './components/Success';
import {IAddressForm, IProduct, IValidForm} from './types';
import {ApiListResponse} from './components/base/Api';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const addressTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appState = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const addressForm = new Address(cloneTemplate(addressTemplate), events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
    onClick: () => modal.close()
});

// Блокируем прокрутку страницы
events.on('modal:open', () => {
    page.locked = true;
});

// Снять блокировку прокрутки страницы
events.on('modal:close', () => {
    page.locked = false;
});

// Получаем товар с сервера
api.getProductList()
    .then(appState.setCatalog.bind(appState))
    .catch(err => console.error(err));

// Отображение товаров на странице
events.on('items:changed', () => {
    page.catalog = appState.catalog.map(item => {
        const cardCatalog = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });

        return cardCatalog.render({
            id: item.id,
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category
        })
    })
});

// Открыть карточку товара
events.on('card:select', (item: IProduct) => {
    events.emit('modal:open');
    const cardItem = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (!item.selected)
                events.emit('item:addBasket', item)
            else events.emit('item:removeBasket', item)
            cardItem.toggleButton(item.selected)
        }
    });

    modal.render({
        content: cardItem.render({
            id: item.id,
            title: item.title,
            image: item.image,
            category: item.category,
            description: item.description,
            price: item.price,
            selected: item.selected,
        })
    })
});

// Добавить товар в корзину
events.on('item:addBasket', (item: IProduct) => {
    item.selected = true;
    appState.add(item);
    appState.selected()
    page.counter = appState.count;
    basket.price = appState.total;
    modal.close();
});

// Открыть корзину
events.on('basket:open', () => {
    events.emit('modal:open');
    const basketList = appState.basket.map((item) => {
        const cardItem = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('item:removeBasket', item)
        });

        return cardItem.render({
            title: item.title,
            price: item.price
        })
    });

    modal.render({
        content: basket.render({
            items: basketList,
            total: appState.total
        })
    })

    !appState.basket.length ?
    basket.disableButton(true) : basket.disableButton(false)
});

// Удалить товар из корзины
events.on('item:removeBasket', (item: IProduct) => {
    item.selected = false;
    appState.remove(item.id);
    page.counter = appState.count;
    basket.price = appState.total;
    events.emit('basket:open')
});

// Модальное окно с адресом
events.on('address:open', () => {
    modal.render({
        content: addressForm.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        })
    })
});

// Отобразить форму заказ оформлен
events.on('address:submit', () => {
    appState.order.total = appState.total;
    appState.selected()

    modal.render({
        content: contactsForm.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    })
});

// Отправка заказа на сервер
events.on('contacts:submit', () => {
    const url = '/order';

    api.post(url, appState.order)
        .then(res => {
            modal.close();
            events.emit('order:success', res);
            appState.resetDataOrder();
            appState.resetSelected();
            appState.resetBasket();
            page.counter = appState.resetCount();
        })
        .catch(err => console.error(err))
});

// Изменилось состояние валидации формы способа оплаты и адреса доставки
events.on('addressErrors:change', (errors: Partial<IValidForm>) => {
    const { payment, address } = errors;
    addressForm.valid = !payment && !address;
    addressForm.errors = Object.values({ payment, address }).filter((i) => !!i).join('; ');
});

// Изменилось состояние валидации формы email и phone
events.on('contactsErrors:change', (errors: Partial<IValidForm>) => {
    const { email, phone } = errors;
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({ email, phone }).filter((i) => !!i).join('; ');
});

// Изменилось одно из полей заказа
events.on('order:change',(data: {field: keyof IValidForm; value: string}) => {
        appState.setDataOrder(data.field, data.value);
});

// Отображение итоговой цены в форме успешного оформления заказа
events.on('order:success', (res: ApiListResponse<string>) => {
    modal.render({
        content: success.render({
            total: res.total
        })
    })
});


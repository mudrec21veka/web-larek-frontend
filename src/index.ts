import './scss/styles.scss';

import {EventEmitter} from "./components/base/events";
import {AppData} from "./components/AppData";
import {Card} from "./components/Card";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {Page} from "./components/Page";
import {LarekAPI} from "./components/LarekAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {Product} from "./components/Product";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/Basket";
import {DeliverForm} from "./components/DeliverForm";
import {ContactForm} from "./components/ContactForm";
import {ApiListResponse} from "./components/base/api";
import {SuccessForm} from "./components/SuccessForm";
import {IOrderForm} from "./types";

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Все шаблоны
const cardCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения 
const appData = new AppData({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new DeliverForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactForm(cloneTemplate(contactsTemplate), events);
const success = new SuccessForm(cloneTemplate(successTemplate), {
    onClick: () => modal.close()
});

// Получение товаров с сервера
api.getProductList()
  .then(appData.setCatalog.bind(appData))
  .catch((err) => {
       console.error(err);
  });

// Отображение товаров на странице
events.on('items:render', () => {
    page.list = appData.catalog.map((item) => {
        const cardTemplate = new Card(cloneTemplate(cardCatalog), {
            onClick: () => events.emit('card:selected', item),
        });

        return cardTemplate.render({
            id: item.id,
            category: item.category,
            title: item.title,
            price: item.price,
            image: item.image,
            description: item.description,
        });
    });
});

// Открыть карточку товара
events.on('card:selected', (item: Product) => {
    events.emit('modal:open');

    const cardTemplate = new Card(cloneTemplate(cardPreview), {
        onClick: () => {
            events.emit('item:addInBasket', item);
        },
    });

    modal.render({
        content: cardTemplate.render({
            id: item.id,
            title: item.title,
            image: item.image,
            category: item.category,
            description: item.description,
            price: item.price,
            selected: item.selected,
        }),
    });
});

// Добавить товар в корзину
events.on('item:addInBasket', (item: Product) => {
    item.selected = true;
    appData.add(item);
    appData.setCustomerData();
    modal.close();
});

// Открыть корзину
events.on('basket:open', () => {
    events.emit('modal:open');

    const cardsBasket = appData.basket.map((item) => {
        const cardTemplate = new Card(cloneTemplate(cardBasket), {
            onClick: () => {
                events.emit('item:remove', item);
            },
        });

        return cardTemplate.render({
            title: item.title,
            price: item.price,
        });
    });

    modal.render({
        content: basket.render({
            items: cardsBasket,
            price: appData.totalPrice,
        }),
    });

    basket.disableButton(!appData.basket.length);
});

// Удалить товар из корзины
events.on('item:remove', (item: Product) => {
    item.selected = false;
    appData.remove(item.id);
    basket.price = appData.totalPrice;
    events.emit('basket:open');
});

// Оформить заказ
events.on('order:open', () => {
    modal.render({
        content: order.render({
            address: '',
            valid: false,
            errors: [],
        }),
    });
});

// Отобразить форму заказ оформлен
events.on('order:submit', () => {
    appData.order.total = appData.totalPrice;

    modal.render({
        content: contacts.render({
            phone: '',
            email: '',
            valid: false,
            errors: [],
        }),
    });
});

// Отправка заказа на сервер
events.on('contacts:submit', () => {
    const url = '/order';

    api.post(url, appData.order)
       .then((result) => {
           modal.close();
           events.emit('order:success', result);
           appData.resetBasket();
           appData.resetOrder();
       })
       .catch((err) => {
           console.error(err);
       });
});

// Отображение итоговой цены в форме успешного оформления заказа
events.on('order:success', (result: ApiListResponse<string>) => {
    modal.render({
        content: success.render({
            count: result.total,
        }),
    });
});

// Блокировка прокрутки страницы
events.on('modal:open', () => {
    page.blocked = true;
});

// Снять блокировку прокрутки страницы
events.on('modal:close', () => {
    page.blocked = false;
});

// Изменилось состояние валидации формы способа оплаты и адреса доставки
events.on('orderErrors:change', (errors: Partial<IOrderForm>) => {
    const { address, payment } = errors;
    order.valid = !address && !payment;
    order.errors = Object.values({ address, payment }).filter((i) => !!i).join('; ');
});

// Изменилось состояние валидации формы email и phone
events.on('contactsErrors:change', (errors: Partial<IOrderForm>) => {
    const { email, phone } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({ email, phone }).filter((i) => !!i).join('; ');
});

// Изменилось одно из полей заказа
events.on('order:change',(data: { field: keyof IOrderForm; value: string }) => {
        appData.setOrderField(data.field, data.value);
    }
);

import {Api, ApiListResponse} from './base/api';
import {ICard} from '../types';

export interface ILarekAPI {
    getProduct: (id: string) => Promise<ICard>;
    getProductList: () => Promise<ICard[]>;
}

/**
 * Класс для взаимодействия с сервером, наследуется от класса Api (реализация слоя Model).
 * Методы класса используются для получения данных с сервера и предоставления данных в Presenter для отображения в компонентах (View)
 */

export class LarekAPI extends Api implements ILarekAPI {
    //API_ORIGIN
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    //получение товара
    getProduct(id: string): Promise<ICard> {
        return this.get(`/product/${id}`)
            .then((item: ICard) => ({
            ...item,
            image: this.cdn + item.image,
        }));
    }

    //получение списка товаров
    getProductList(): Promise<ICard[]> {
        return this.get('/product')
            .then((data: ApiListResponse<ICard>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image,
            }))
        );
    }
}
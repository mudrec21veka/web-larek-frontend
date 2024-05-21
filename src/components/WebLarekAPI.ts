import { Api, ApiListResponse } from './base/Api';
import {IProduct} from "../types";

/**
 * Класс для взаимодействия с сервером, наследуется от класса Api (реализация слоя Model).
 * Методы класса используются для получения данных с сервера и предоставления данных в Presenter для отображения в компонентах (View)
 */

export interface IWebLarekAPI {
    //API_ORIGIN
    getProductList: () => Promise<IProduct[]>;
    getProduct: (id: string) => Promise<IProduct>;
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    //получить товар
    getProduct(id: string): Promise<IProduct> {
        return this.get(`/product/${id}`).then(
            (item: IProduct) => ({
                ...item,
                image: this.cdn + item.image
            })
        )
    };

    //получить список товаров
    getProductList(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map(item => ({
                ...item,
                image: this.cdn + item.image
            }))
        )
    }
}
import {IProduct} from "../types";
import {Category} from "../types";
import {Model} from './base/model';

/**
 * Класс описывающий свойства товара, наследуется от класса Model (реализация слоя Model).
 */
export class Product extends Model<IProduct> {
    id: string;
    category: Category;
    title: string;
    description: string;
    image: string;
    price: number | null;
    selected: boolean;
}
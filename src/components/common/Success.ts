import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";

interface ISuccess {
    total: number
};

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _total: HTMLElement;
    protected _close: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);
        this._total = ensureElement<HTMLParagraphElement>('.order-success__description', this.container);
        this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        if (actions?.onClick) {
            if (this._close)
                this._close.addEventListener('click', actions.onClick);
            else container.addEventListener('click', actions.onClick);
        }
    };
    
    //установка количества списанных синапсов
    set total(total: number) {
        this.setText(this._total, `Списано ${total} синапсов`)
    }
}
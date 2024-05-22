/**
 * Класс обеспечивает методами для работы с DOM.
 * Его функции: устанавливать данные в компонентах, а также отрисовывать их
 */
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {}

  // Переключить класс
  toggleClass(element: HTMLElement, className: string, force?: boolean) {
    element.classList.toggle(className, force);
}

  // Установить текстовое содержимое
  protected setText(element: HTMLElement, value: string) {
    if (element) {
        element.textContent = value;
    }
}

  // Сменить статус блокировки
  setDisabled(element: HTMLElement, state: boolean) {
      if (element) {
          if (state) element.setAttribute('disabled', 'disabled');
          else element.removeAttribute('disabled');
      }
  }

  // Скрыть компонент
  protected setHidden(element: HTMLElement) {
      element.style.display = 'none';
  }

  // Показать компонент
  protected setVisible(element: HTMLElement) {
      element.style.removeProperty('display');
  }

  // Установить изображение с алтернативным текстом
  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
      if (element) {
          element.src = src;
          if (alt) {
              element.alt = alt;
          }
      }
  }

  // Вернуть корневой DOM-элемент
  render(data?: Partial<T>): HTMLElement {
      Object.assign(this as object, data ?? {});
      return this.container;
  }
}
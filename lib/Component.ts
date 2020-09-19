import { EventTypes } from './Enums';
import { Template } from './Types';
import Coordinates from './helpers/Coordinates';
import PropsContext from './PropsContext';
import RenderingContext from './RenderingContext';
import RenderUtils from './utils/Render';
import Store from './store/Store';

export default abstract class Component<P> {
  private _template: Template = [];
  private initialized = false;
  private _stores: { [key: string]: Store<any> } = {};

  protected onTick(ctx: PropsContext<P>, timeDifference: number): void {
    return;
  }
  protected onInit(): void {
    return;
  }

  protected set template(tmp: Template) {
    this._template = tmp;
  }

  public registerStore(name: string, store: Store<any>): void {
    // Store in dieser Klasse verlinken
    this._stores[name] = store;

    // Bei allen Sub-Components registerStore ausführen
    this._template.forEach(el => {
      el.component.registerStore(name, store);
    });
  }

  public propagateEvent(type: EventTypes, event: Event): void {
    // Event an alle Sub-Components weitergeben
    this._template.forEach(el => {
      if (typeof el.show === 'function' && !el.show()) return;
      el.component.propagateEvent(type, event);
    });
  }

  protected get stores(): { [key: string]: Store<any> } {
    return this._stores;
  }

  public render(context: RenderingContext, position: Coordinates, props: P): void {
    // Beim ersten Ausführen onInit Methode ausführen
    if (!this.initialized) {
      this.onInit();
      this.initialized = true;
    }

    const propsContext = new PropsContext<P>(props);

    // Platzhalter- oder ersetzte onTick Methode ausführen
    this.onTick(propsContext, context.timeDifference);

    // Template rendern
    this._template.forEach((el): void => {
      RenderUtils.renderTemplateItem(el, context, position, propsContext);
    });
  }
}

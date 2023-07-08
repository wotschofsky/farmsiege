import { EventTypes } from './Enums';
import { Template } from './Types';
import Coordinates from './helpers/Coordinates';
import PropsContext from './PropsContext';
import RenderingContext from './RenderingContext';
import RenderUtils from './utils/Render';
import Store from './store/Store';

export default abstract class Component<P> {
  protected template: Template = [];
  private initialized = false;
  private _stores: { [key: string]: Store<any> } = {};

  protected onTick(ctx: PropsContext<P>, timeDifference: number): void {
    ctx;
    timeDifference;
    return;
  }

  protected onInit(): void {
    return;
  }

  public registerStore(name: string, store: Store<any>): void {
    // Link the store to this class
    this._stores[name] = store;

    // Call registerStore on all sub-components
    this.template.forEach(el => {
      el.component.registerStore(name, store);
    });
  }

  public propagateEvent(type: EventTypes, event: Event): void {
    // Propagate the event to all sub-components
    this.template.forEach(el => {
      if (typeof el.show === 'function' && !el.show()) return;
      el.component.propagateEvent(type, event);
    });
  }

  protected get stores(): { [key: string]: Store<any> } {
    return this._stores;
  }

  public render(context: RenderingContext, position: Coordinates, props: P): void {
    // Execute onInit method on the first render
    if (!this.initialized) {
      this.onInit();
      this.initialized = true;
    }

    const propsContext = new PropsContext<P>(props);

    // Execute onTick method to perform actions on each tick
    this.onTick(propsContext, context.timeDifference);

    // Render the template
    this.template.forEach((el): void => {
      RenderUtils.renderTemplateItem(el, context, position, propsContext);
    });
  }
}

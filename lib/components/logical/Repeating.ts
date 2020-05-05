import { EventTypes } from '../../Enums';
import Component from '../../Component';
import Coordinates from '../../helpers/Coordinates';
import PropsContext from '../../PropsContext';
import RenderUtils from '../../utils/Render';

export type RepeatingProps = {
  list: any[];
  component: (data: any, index: number) => Component<any>;
  position: (data: any, index: number) => Coordinates;
  props: (data: any, index: number) => {};
};

export default class Repeating extends Component<RepeatingProps> {
  private listComponents: Component<any>[] = [];

  public propagateEvent(type: EventTypes, event: Event): void {
    this.listComponents.forEach(el => {
      el.propagateEvent(type, event);
    });
  }

  public render(context: RenderingContext, position: Coordinates, props: RepeatingProps): void {
    const listLength = props.list.length;
    if (listLength < this.listComponents.length) {
      this.listComponents = this.listComponents.splice(listLength);
    }

    props.list.forEach((data, index) => {
      if (!this.listComponents[index]) {
        const cmp = props.component(data, index);
        this.listComponents[index] = cmp;
      }

      const propsContext = new PropsContext(props.props(data, index));
      RenderUtils.renderTemplateItem(
        {
          component: this.listComponents[index],
          position: () => props.position(data, index),
          props: () => props.props(data, index)
        },
        context,
        position,
        propsContext
      );
    });
  }
}

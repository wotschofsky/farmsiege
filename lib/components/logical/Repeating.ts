import { EventTypes } from '../../Enums';
import Component from '../../Component';
import Coordinates from '../../helpers/Coordinates';
import PropsContext from '../../PropsContext';
import RenderingContext from '../../RenderingContext';
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
    // Propagate the event to all components in this list
    for (const el of this.listComponents) {
      el.propagateEvent(type, event);
    }
  }

  public render(context: RenderingContext, position: Coordinates, props: RepeatingProps): void {
    const listLength = props.list.length;

    // If the array of cached component instances is longer than the array to be rendered,
    // delete the unused instances
    if (listLength < this.listComponents.length) {
      this.listComponents = this.listComponents.splice(listLength);
    }

    // Iterate through all items in the specified list
    props.list.forEach((data, index) => {
      // If there is no cached instance of the component for the specified index, create a new one
      // using the function provided through props
      if (!this.listComponents[index]) {
        const cmp = props.component(data, index);
        this.listComponents[index] = cmp;
      }

      // Calculate props for the current item
      const resolvedProps = props.props(data, index);
      const propsContext = new PropsContext(resolvedProps);

      // Create a TemplateItem and render it
      RenderUtils.renderTemplateItem(
        {
          component: this.listComponents[index],
          position: () => props.position(data, index),
          props: () => resolvedProps
        },
        context,
        position,
        propsContext
      );
    });
  }
}

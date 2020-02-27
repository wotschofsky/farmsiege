import Component from '../../Component';
import RenderUtils from '../../utils/Render';
import PropsContext from '../../PropsContext';
import Coordinates from '../../helpers/Coordinates';

export type RepeatingProps = {
  list: any[];
  component: (data: any, index: number) => Component<any>;
  position: (data: any, index: number) => Coordinates;
  props: (data: any, index: number) => {};
};

export default class Repeating extends Component<RepeatingProps> {
  private listLength: number;
  private listComponents: Component<any>[] = [];

  public render(context: RenderingContext, position: Coordinates, props: RepeatingProps): void {
    this.listLength = props.list.length;
    if (this.listLength < this.listComponents.length) {
      this.listComponents = this.listComponents.splice(this.listLength);
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

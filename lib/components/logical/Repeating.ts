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
    // Event an alle Components dieser Liste weitergeben
    for (const el of this.listComponents) {
      el.propagateEvent(type, event);
    }
  }

  public render(context: RenderingContext, position: Coordinates, props: RepeatingProps): void {
    const listLength = props.list.length;

    // Wenn das Array der gecachten Component Instanzen länger ist als das zu rendernde Array,
    // werden die ungenutzten gelöscht
    if (listLength < this.listComponents.length) {
      this.listComponents = this.listComponents.splice(listLength);
    }

    // Alle items in der angegebenen Liste durchgehen
    props.list.forEach((data, index) => {
      // Wenn für den angegebenen Index keine Instanz des Components gecacht ist eine neue erstellen
      // Dazu wird die über die Props angegebene Funktion verwendet
      if (!this.listComponents[index]) {
        const cmp = props.component(data, index);
        this.listComponents[index] = cmp;
      }

      // Props für das aktuelle Item errechnen lassen
      const resolvedProps = props.props(data, index);
      const propsContext = new PropsContext(resolvedProps);

      // TemplateItem erstellen und dieses rendern
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

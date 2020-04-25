import Component from '../../Component';
import RenderingContext from '../../RenderingContext';
import Coordinates from '../../helpers/Coordinates';
import { EventTypes } from '../../Enums';
import Dimensions from '../../helpers/Dimensions';

export type ClickListener = (position: Coordinates) => void;
export type KeypressListener = (event: KeyboardEvent) => void;

export type EventListenerProps = {
  size: Dimensions;
  onClick?: ClickListener;
  onKeypress?: KeypressListener;
  visualize?: boolean;
};

export default class EventListener extends Component<EventListenerProps> {
  private clickListener: ClickListener | null = null;
  private keypressListener: KeypressListener | null = null;

  private componentPosition: Coordinates;
  private componentSize: Dimensions;
  private renderContext: RenderingContext;
  private gridSize: Dimensions;

  public constructor() {
    super();
  }

  private isWithinBoundaries(position: Coordinates): boolean {
    return (
      position.x < this.componentPosition.x + this.componentSize.width + this.renderContext.parentX &&
      position.y < this.componentPosition.y + this.componentSize.height + this.renderContext.parentY &&
      position.x > this.componentPosition.x + this.renderContext.parentX &&
      position.y > this.componentPosition.y + this.renderContext.parentY
    );
  }

  private getMouseEventPosition(event: MouseEvent): Coordinates {
    const rect = this.renderContext.canvas.getBoundingClientRect();
    const position = new Coordinates(
      ((event.clientX - rect.left) / rect.width) * this.gridSize.width,
      ((event.clientY - rect.top) / rect.height) * this.gridSize.height
    );
    return position;
  }

  public propagateEvent(type: EventTypes, event: Event): void {
    switch (type) {
      case EventTypes.Click:
        const position = this.getMouseEventPosition(<MouseEvent>event);
        if (this.clickListener && this.isWithinBoundaries(position)) {
          this.clickListener(position);
        }
        break;
      case EventTypes.Keypress:
        if (this.keypressListener) {
          this.keypressListener(<KeyboardEvent>event);
        }
        break;
    }
  }

  public render(context: RenderingContext, position: Coordinates, props: EventListenerProps): void {
    this.clickListener = props.onClick || null;
    this.keypressListener = props.onKeypress || null;

    this.componentPosition = position;
    this.componentSize = props.size;
    this.renderContext = context;
    this.gridSize = context.grid;

    if (props.visualize) {
      context.renderContext.beginPath();
      context.renderContext.rect(
        (position.x + context.parentX) * context.scaleFactor,
        (position.y + context.parentY) * context.scaleFactor,
        props.size.width * context.scaleFactor,
        props.size.height * context.scaleFactor
      );

      context.renderContext.lineWidth = 5;
      context.renderContext.strokeStyle = '#0f0';
      context.renderContext.stroke();
    }
  }
}

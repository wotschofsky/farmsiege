import { EventTypes } from '../../Enums';
import Component from '../../Component';
import Coordinates from '../../helpers/Coordinates';
import Dimensions from '../../helpers/Dimensions';
import RenderingContext from '../../RenderingContext';

export type MouseListener = (event: MouseEvent) => void;
export type KeyboardListener = (event: KeyboardEvent) => void;

export type EventListenerProps = {
  size: Dimensions;
  onClick?: MouseListener;
  onKeypress?: KeyboardListener;
  onKeydown?: KeyboardListener;
  onKeyup?: KeyboardListener;
  visualize?: boolean;
};

export default class EventListener extends Component<EventListenerProps> {
  private clickListener: MouseListener | null = null;
  private keypressListener: KeyboardListener | null = null;
  private keydownListener: KeyboardListener | null = null;
  private keyupListener: KeyboardListener | null = null;

  private position: Coordinates;
  private dimensions: Dimensions;
  private renderContext: RenderingContext;

  constructor() {
    super();

    this.position = new Coordinates(0, 0);
    this.dimensions = new Dimensions(0, 0);
  }

  private isWithinBoundaries(position: Coordinates): boolean {
    return (
      position.x < this.position.x + this.dimensions.width + this.renderContext.parentX &&
      position.y < this.position.y + this.dimensions.height + this.renderContext.parentY &&
      position.x > this.position.x + this.renderContext.parentX &&
      position.y > this.position.y + this.renderContext.parentY
    );
  }

  private getMouseEventPosition(event: MouseEvent): Coordinates {
    // Calculate the position of the mouse event relative to the canvas element
    const rect = this.renderContext.canvas.getBoundingClientRect();

    const position = new Coordinates(
      ((event.clientX - rect.left) / rect.width) * this.renderContext.grid.width,
      ((event.clientY - rect.top) / rect.height) * this.renderContext.grid.height
    );

    return position;
  }

  public propagateEvent(type: EventTypes, event: Event): void {
    // Execute the corresponding event listener function
    switch (type) {
      case EventTypes.Click:
        // Check if the event is within the boundaries
        const position = this.getMouseEventPosition(<MouseEvent>event);
        if (this.clickListener && this.isWithinBoundaries(position)) {
          this.clickListener(<MouseEvent>event);
        }
        break;
      case EventTypes.Keypress:
        if (this.keypressListener) {
          this.keypressListener(<KeyboardEvent>event);
        }
        break;
      case EventTypes.Keydown:
        if (this.keydownListener) {
          this.keydownListener(<KeyboardEvent>event);
        }
        break;
      case EventTypes.Keyup:
        if (this.keyupListener) {
          this.keyupListener(<KeyboardEvent>event);
        }
        break;
    }
  }

  public render(context: RenderingContext, position: Coordinates, props: EventListenerProps): void {
    // Save the event listener functions
    this.clickListener = props.onClick || null;
    this.keypressListener = props.onKeypress || null;
    this.keydownListener = props.onKeydown || null;
    this.keyupListener = props.onKeyup || null;

    // Transfer data for use outside the rendering process
    this.position = position;
    this.dimensions = props.size;
    this.renderContext = context;

    // Option to visualize the event listener with a green box
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

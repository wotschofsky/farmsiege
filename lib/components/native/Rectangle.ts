import Component from '../../Component';
import Coordinates from '../../helpers/Coordinates';
import RenderingContext from '../../RenderingContext';

export type RectangleProps = {
  width: number;
  height: number;
  borderWidth?: number;
  borderColor?: string;
  color: string;
};

export default class Rectangle extends Component<RectangleProps> {
  public render(context: RenderingContext, position: Coordinates, props: RectangleProps): void {
    // Fläche füllen
    context.renderContext.fillStyle = props.color;
    context.renderContext.fillRect(
      (position.x + context.parentX) * context.scaleFactor,
      (position.y + context.parentY) * context.scaleFactor,
      props.width * context.scaleFactor,
      props.height * context.scaleFactor
    );

    // Umrandung zeichnen
    context.renderContext.beginPath();
    context.renderContext.rect(
      (position.x + context.parentX) * context.scaleFactor,
      (position.y + context.parentY) * context.scaleFactor,
      props.width * context.scaleFactor,
      props.height * context.scaleFactor
    );
    context.renderContext.lineWidth = props.borderWidth || 0;
    context.renderContext.strokeStyle = props.borderColor || 'transparent';
    context.renderContext.stroke();
  }
}

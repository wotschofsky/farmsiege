import Component from '../../Component';
import Coordinates from '../../helpers/Coordinates';
import RenderingContext from '../../RenderingContext';

export type ArcProps = {
  radius: number;
  startingAngle: number;
  endingAngle: number;
  anticlockwise?: boolean;
  color: string;
  borderWidth?: number;
  borderColor?: string;
};

export default class Arc extends Component<ArcProps> {
  public render(context: RenderingContext, position: Coordinates, props: ArcProps): void {
    context.renderContext.beginPath();
    context.renderContext.arc(
      (position.x + context.parentX) * context.scaleFactor,
      (position.y + context.parentY) * context.scaleFactor,
      props.radius,
      props.startingAngle,
      props.endingAngle,
      props.anticlockwise || false
    );
    context.renderContext.fillStyle = props.color;
    context.renderContext.fill();

    context.renderContext.lineWidth = props.borderWidth || 0;
    context.renderContext.strokeStyle = props.borderColor || 'transparent';
    context.renderContext.stroke();
  }
}

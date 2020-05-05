import Component from '../../Component';
import Coordinates from '../../helpers/Coordinates';
import RenderingContext from '../../RenderingContext';

export type TextProps = {
  text: string;
  color?: string;
  font?: string;
  size?: number;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
};

export default class Text extends Component<TextProps> {
  public render(context: RenderingContext, position: Coordinates, props: TextProps): void {
    context.renderContext.textAlign = props.align || 'start';
    context.renderContext.textBaseline = props.baseline || 'alphabetic';
    context.renderContext.fillStyle = props.color || 'black';
    context.renderContext.font = `${(props.size || 16) * context.scaleFactor}px ${props.font || 'Arial'}`;
    context.renderContext.fillText(
      props.text,
      (position.x + context.parentX) * context.scaleFactor,
      (position.y + context.parentY) * context.scaleFactor
    );
  }
}

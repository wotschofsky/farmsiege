import Component from '../../Component';
import Coordinates from '../../helpers/Coordinates';
import RenderingContext from '../../RenderingContext';

export type ClickListener = (position: Coordinates) => void;
export type KeypressListener = (key: string) => void;

export type TextWidthCalculatorProps = {
  text: string;
  font?: string;
  size?: number;
  callback: (width: number) => void;
};

export default class TextWidthCalculator extends Component<TextWidthCalculatorProps> {
  public render(context: RenderingContext, position: Coordinates, props: TextWidthCalculatorProps): void {
    context.renderContext.font = `${props.size || 16}px ${props.font || 'Arial'}`;
    const metrics = context.renderContext.measureText(props.text);
    props.callback(metrics.width);
  }
}

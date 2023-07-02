import Component from '../../Component';
import Coordinates from '../../helpers/Coordinates';
import RenderingContext from '../../RenderingContext';

export type SpriteProps = {
  source: string;
  width: number;
  height: number;
};

export default class Sprite extends Component<SpriteProps> {
  private currentSource: string | null = null;
  private imageElement: HTMLImageElement | null = null;

  public render(context: RenderingContext, position: Coordinates, props: SpriteProps): void {
    // Abort if no sprite is specified
    if (!props.source) {
      return;
    }

    // Load the sprite if the source has changed
    if (this.currentSource !== props.source) {
      this.imageElement = document.createElement('img');
      this.imageElement.src = props.source;

      // Save the source as a reference for the next render cycle
      this.currentSource = props.source;
    }

    // Prevent the sprite from being scaled and blurred
    context.renderContext.imageSmoothingEnabled = false;

    context.renderContext.drawImage(
      <HTMLImageElement>this.imageElement,
      (position.x + context.parentX) * context.scaleFactor,
      (position.y + context.parentY) * context.scaleFactor,
      props.width * context.scaleFactor,
      props.height * context.scaleFactor
    );
  }
}

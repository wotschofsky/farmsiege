import Component from '../../Component';
import Coordinates from '../../helpers/Coordinates';
import RenderingContext from '../../RenderingContext';

export type PatternProps = {
  source: string;
  tileWidth: number;
  tileHeight: number;
  width: number;
  height: number;
  mode: 'repeat' | 'repeat-x' | 'repeat-y';
};

export default class Pattern extends Component<PatternProps> {
  private currentSource: string | null = null;
  private imageElement: HTMLImageElement | null = null;

  public render(context: RenderingContext, position: Coordinates, props: PatternProps): void {
    // Abort if no source is specified
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

    // Calculate the number of rows and columns that fit within the specified dimensions
    const amountRows = Math.ceil(props.height / props.tileHeight);
    const amountCols = Math.ceil(props.width / props.tileWidth);

    for (let row = 0; row < amountRows; row++) {
      for (let col = 0; col < amountCols; col++) {
        const offsetX = props.tileWidth * col;
        const offsetY = props.tileWidth * row;

        context.renderContext.drawImage(
          this.imageElement as HTMLImageElement,
          (position.x + context.parentX + offsetX) * context.scaleFactor,
          (position.y + context.parentY + offsetY) * context.scaleFactor,
          props.tileWidth * context.scaleFactor,
          props.tileHeight * context.scaleFactor
        );
      }
    }
  }
}

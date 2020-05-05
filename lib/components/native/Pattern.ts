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
    // Abbrechen, wenn kein Sprite angegeben ist
    if (!props.source) {
      return;
    }

    // Sprite laden, wenn sich die Source geändert hat
    if (this.currentSource !== props.source) {
      this.imageElement = document.createElement('img');
      this.imageElement.src = props.source;

      // Source als Referenz für nächsten Renderzyklus speichern
      this.currentSource = props.source;
    }

    // Verhindern, dass Sprite skaliert und unscharf wird
    context.renderContext.imageSmoothingEnabled = false;

    // Anzahl Reihen & Spalten, die in die angegebenen Maße passen errechnen
    const amountRows = Math.ceil(props.height / props.tileHeight);
    const amountCols = Math.ceil(props.width / props.tileWidth);

    for (let row = 0; row < amountRows; row++) {
      for (let col = 0; col < amountCols; col++) {
        const offsetX = props.tileWidth * col;
        const offsetY = props.tileWidth * row;

        context.renderContext.drawImage(
          <HTMLImageElement>this.imageElement,
          (position.x + context.parentX + offsetX) * context.scaleFactor,
          (position.y + context.parentY + offsetY) * context.scaleFactor,
          props.tileWidth * context.scaleFactor,
          props.tileHeight * context.scaleFactor
        );
      }
    }
  }
}

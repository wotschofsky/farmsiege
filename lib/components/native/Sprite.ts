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

    context.renderContext.drawImage(
      <HTMLImageElement>this.imageElement,
      (position.x + context.parentX) * context.scaleFactor,
      (position.y + context.parentY) * context.scaleFactor,
      props.width * context.scaleFactor,
      props.height * context.scaleFactor
    );
  }
}

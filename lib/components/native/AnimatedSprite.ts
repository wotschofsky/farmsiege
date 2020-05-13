import Component from '../../Component';
import Coordinates from '../../helpers/Coordinates';
import RenderingContext from '../../RenderingContext';

export type AnimatedSpriteProps = {
  source: string;
  spriteWidth: number;
  spriteHeight: number;
  width: number;
  height: number;
  interval: number;
};

export default class AnimatedSprite extends Component<AnimatedSpriteProps> {
  private currentSource: string | null = null;
  private imageElement: HTMLImageElement | null = null;

  private currentIndex = 0;
  private length = 1;
  private nextUpdate = window.performance.now();

  public render(context: RenderingContext, position: Coordinates, props: AnimatedSpriteProps): void {
    // Abbrechen, wenn kein Sprite angegeben ist
    if (!props.source) {
      return;
    }

    // Sprite laden, wenn sich die Source geändert hat
    if (this.currentSource !== props.source) {
      this.imageElement = <HTMLImageElement>document.createElement('img');
      this.imageElement.src = props.source;

      this.imageElement.addEventListener('load', () => {
        // Anzahl an Sprites errechnen
        this.length = (<HTMLImageElement>this.imageElement).naturalWidth / props.spriteWidth;
      });

      // Source als Referenz für nächsten Renderzyklus speichern
      this.currentSource = props.source;
    }

    // Verhindern, dass Sprite skaliert und unscharf wird
    context.renderContext.imageSmoothingEnabled = false;

    context.renderContext.drawImage(
      <HTMLImageElement>this.imageElement,
      this.currentIndex * props.spriteWidth,
      0,
      props.spriteWidth,
      props.spriteHeight,
      (position.x + context.parentX) * context.scaleFactor,
      (position.y + context.parentY) * context.scaleFactor,
      props.width * context.scaleFactor,
      props.height * context.scaleFactor
    );

    // Wenn nächster Frame angezeigt werden soll...
    while (this.nextUpdate <= context.frameStart) {
      if (this.currentIndex + 1 === this.length) {
        // Index zurücksetzen, wenn alle Sprites angezeigt wurden
        this.currentIndex = 0;
      } else {
        // Index inkrementieren
        this.currentIndex++;
      }

      // Timestamp für nächsten Sprite errechnen
      this.nextUpdate = this.nextUpdate + props.interval;
    }
  }
}

import Component from '../../Component';
import RenderingContext from '../../RenderingContext';
import Coordinates from '../../helpers/Coordinates';

export type AnimatedSpriteProps = {
  source: string;
  spriteWidth: number;
  spriteHeight: number;
  width: number;
  height: number;
  interval: number;
};

export default class AnimatedSprite extends Component<AnimatedSpriteProps> {
  private lastSource: string | null = null;
  private imageElement: HTMLImageElement | null = null;

  private index = 0;
  private size = 1;
  private nextUpdate = Date.now();

  public render(context: RenderingContext, position: Coordinates, props: AnimatedSpriteProps): void {
    // Abbrechen, wenn kein Sprite angegeben ist
    if (!props.source) return;

    // Bild neu laden, wenn sich Quelle geändert hat
    if (this.lastSource !== props.source) {
      this.imageElement = document.createElement('img');
      this.imageElement.src = props.source;
      this.imageElement.addEventListener('load', () => {
        this.size = (this.imageElement as HTMLImageElement).naturalWidth / props.spriteWidth;
      });
    }

    this.lastSource = props.source;

    context.renderContext.imageSmoothingEnabled = false;
    context.renderContext.drawImage(
      this.imageElement as HTMLImageElement,
      this.index * props.spriteWidth,
      0,
      props.spriteWidth,
      props.spriteHeight,
      (position.x + context.parentX) * context.scaleFactor,
      (position.y + context.parentY) * context.scaleFactor,
      props.width * context.scaleFactor,
      props.height * context.scaleFactor
    );

    while (this.nextUpdate <= context.frameStart) {
      if (this.index + 1 === this.size) {
        this.index = 0;
        this.nextUpdate = this.nextUpdate + props.interval;
      } else {
        this.index = this.index + 1;
        this.nextUpdate = this.nextUpdate + props.interval;
      }
    }
  }
}

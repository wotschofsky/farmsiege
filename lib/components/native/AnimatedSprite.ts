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
    // Abort if no sprite is specified
    if (!props.source) {
      return;
    }

    // Load sprite if the source has changed
    if (this.currentSource !== props.source) {
      this.imageElement = <HTMLImageElement>document.createElement('img');
      this.imageElement.src = props.source;

      this.imageElement.addEventListener('load', () => {
        // Calculate number of sprites
        this.length = (<HTMLImageElement>this.imageElement).naturalWidth / props.spriteWidth;
      });

      // Save source as a reference for the next render cycle
      this.currentSource = props.source;
    }

    // Prevent sprite from being scaled and blurred
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

    // If the next frame should be displayed...
    while (this.nextUpdate <= context.frameStart) {
      if (this.currentIndex + 1 === this.length) {
        // Reset index if all sprites have been displayed
        this.currentIndex = 0;
      } else {
        // Increment index
        this.currentIndex++;
      }

      // Calculate timestamp for the next sprite
      this.nextUpdate = this.nextUpdate + props.interval;
    }
  }
}

import Component from '../../Component';
import RenderingContext from '../../RenderingContext';
import Coordinates from '../../helpers/Coordinates';

export type SpriteProps = {
  source: string;
  width: number;
  height: number;
};

export default class Sprite extends Component<SpriteProps> {
  private lastSource: string | null = null;
  private imageElement: HTMLImageElement | null = null;

  public render(context: RenderingContext, position: Coordinates, props: SpriteProps): void {
    if (!props.source) return;
    if (this.lastSource !== props.source) {
      this.imageElement = document.createElement('img');
      this.imageElement.src = props.source;
      // this.imageElement.addEventListener('load', function(event) {
      //    // console.log(event.target.naturalWidth)
      //    console.log(this.naturalHeight)
      // })
    }

    this.lastSource = props.source;

    // context.drawImage(this.imageElement, props.x, props.y, props.width, props.height, 10, 10, 50, 60);
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

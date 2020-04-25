import { TemplateItem } from '../Types';
import Coordinates from '../helpers/Coordinates';
import PropsContext from '../PropsContext';
import RenderingContext from '../RenderingContext';

export default class RenderUtils {
  public static renderTemplateItem(
    item: TemplateItem,
    context: RenderingContext,
    position: Coordinates,
    propsContext: PropsContext<any>
  ): void {
    if (typeof item.show === 'function' && !item.show(propsContext)) return;

    let computedParentX = context.parentX + position.x;
    let computedParentY = context.parentY + position.y;

    const applyTransformations = !!item.transform;

    if (applyTransformations && item.transform) {
      context.renderContext.save();

      const transformConfig = item.transform(propsContext);

      if (transformConfig.rotate) {
        const { center } = transformConfig.rotate;
        context.renderContext.translate(
          context.scaleFactor * (context.parentX + position.x + center.x),
          context.scaleFactor * (context.parentY + position.y + center.y)
        );

        computedParentX = -center.x;
        computedParentY = -center.y;

        context.renderContext.rotate(transformConfig.rotate.angle);
      }

      if (transformConfig.opacity) {
        context.renderContext.globalAlpha = transformConfig.opacity.value;
      }

      if (transformConfig.clip) {
        const ownPosition = item.position(propsContext);

        context.renderContext.beginPath();
        context.renderContext.arc(
          (transformConfig.clip.circle.center.x + ownPosition.x + computedParentX) * context.scaleFactor,
          (transformConfig.clip.circle.center.y + ownPosition.y + computedParentY) * context.scaleFactor,
          transformConfig.clip.circle.radius * context.scaleFactor,
          0,
          2 * Math.PI
        );
        context.renderContext.clip();
      }
    }

    item.component.render(
      new RenderingContext(
        context.grid,
        computedParentX,
        computedParentY,
        context.canvas,
        context.renderContext,
        context.scaleFactor,
        context.timeDifference,
        context.frameStart
      ),
      item.position(propsContext),
      typeof item.props === 'function' ? item.props(propsContext) : {}
    );

    if (applyTransformations) {
      context.renderContext.restore();
    }
  }
}

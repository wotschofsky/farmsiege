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

    let computedPositionX = context.parentX + position.x;
    let computedPositionY = context.parentY + position.y;

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

        computedPositionX = -center.x;
        computedPositionY = -center.y;

        context.renderContext.rotate(transformConfig.rotate.angle);
      }

      if (transformConfig.opacity) {
        context.renderContext.globalAlpha = transformConfig.opacity.value;
      }
    }

    item.component.render(
      new RenderingContext(
        context.frame,
        computedPositionX,
        computedPositionY,
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

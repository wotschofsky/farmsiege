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

    const applyTransformations = !!item.transform;
    if (applyTransformations && item.transform) {
      context.renderContext.save();
    }

    item.component.render(
      new RenderingContext(
        context.frame,
        context.parentX + position.x,
        context.parentY + position.y,
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

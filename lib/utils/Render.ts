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
    // Abort if the component should not be shown
    if (typeof item.show === 'function' && !item.show(propsContext)) {
      return;
    }

    let computedParentX = context.parentX + position.x;
    let computedParentY = context.parentY + position.y;

    if (item.transform) {
      // Save the configuration
      context.renderContext.save();

      const transformConfig = item.transform(propsContext);

      if (transformConfig.rotate) {
        const { center } = transformConfig.rotate;

        // Translate to the rotation center
        context.renderContext.translate(
          context.scaleFactor * (computedParentX + center.x),
          context.scaleFactor * (computedParentY + center.y)
        );

        // Adjust parent coordinates to the new coordinate system
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
          (computedParentX + ownPosition.x + transformConfig.clip.circle.center.x) * context.scaleFactor,
          (computedParentY + ownPosition.y + transformConfig.clip.circle.center.y) * context.scaleFactor,
          transformConfig.clip.circle.radius * context.scaleFactor,
          0,
          2 * Math.PI
        );
        context.renderContext.clip();
      }
    }

    // Render the template item
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
      this.getProps(propsContext, item.props)
    );

    if (item.transform) {
      // Restore the configuration
      context.renderContext.restore();
    }
  }

  private static getProps(
    propsContext: PropsContext<any>,
    propsFunction?: (context: PropsContext<any>) => { [key: string]: any }
  ): object {
    if (typeof propsFunction === 'function') {
      return propsFunction(propsContext);
    }
    return {};
  }
}

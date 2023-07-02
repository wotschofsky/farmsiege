import Component from '../../lib/Component';
import RenderingContext from '../../lib/RenderingContext';

import EffectsStore from '../store/EffectsStore';

export type GameOverEffectProps = {};

export default class GameOverEffect extends Component<GameOverEffectProps> {
  // Based on https://stackoverflow.com/a/6271865
  public render(context: RenderingContext): void {
    // Abort if the effect is not active
    const effectsStore = <EffectsStore>this.stores.effects;
    const effectData = effectsStore.content.gameOver;
    if (!effectData.active) {
      return;
    }

    // Create a canvas that we will use as a mask
    const maskCanvas = document.createElement('canvas');
    // Ensure same dimensions
    maskCanvas.width = context.canvas.width;
    maskCanvas.height = context.canvas.height;
    const maskCtx = maskCanvas.getContext('2d');

    if (maskCtx) {
      // Fill the entire screen with black
      maskCtx.fillStyle = '#000';
      maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

      // Set the masking mode
      maskCtx.globalCompositeOperation = 'xor';

      // Set the visible area
      const distanceToCorner = Math.max(
        // Distance to top-left
        Math.sqrt(effectData.center.x ** 2 + effectData.center.y ** 2),
        // Distance to top-right
        Math.sqrt((1600 - effectData.center.x) ** 2 + effectData.center.y ** 2),
        // Distance to bottom-left
        Math.sqrt(effectData.center.x ** 2 + (1200 - effectData.center.y) ** 2),
        // Distance to bottom-right
        Math.sqrt((1600 - effectData.center.x) ** 2 + (1200 - effectData.center.y) ** 2)
      );

      const effectsStore = <EffectsStore>this.stores.effects;
      const { center } = effectsStore.content.gameOver;

      // Draw a circle
      maskCtx.arc(
        (center.x + context.parentX) * context.scaleFactor,
        (center.y + context.parentY) * context.scaleFactor,
        distanceToCorner * (1 - effectsStore.endAnimationProgress),
        0,
        2 * Math.PI
      );
      maskCtx.fill();

      // Transfer the overlay to the main canvas
      context.renderContext.drawImage(maskCanvas, 0, 0);
    }
  }
}

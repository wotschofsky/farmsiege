import { Template } from '../../../lib/Types';
import AnimatedSprite, { AnimatedSpriteProps } from '../../../lib/components/native/AnimatedSprite';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';

import lightning from '../../assets/lightning.png';

export type LightningProps = {};

export default class Lightning extends Component<LightningProps> {
  protected template: Template = [
    {
      component: new AnimatedSprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): AnimatedSpriteProps => ({
        source: lightning,
        interval: 100,
        width: 128,
        height: 256,
        spriteWidth: 256,
        spriteHeight: 512
      })
    }
  ];
}

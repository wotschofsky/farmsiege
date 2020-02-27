import { Template } from '../../lib/Types';
import AnimatedSprite, { AnimatedSpriteProps } from '../../lib/components/native/AnimatedSprite';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import PropsContext from '../../lib/PropsContext';

import smokeSprites from '../assets/smoke.png';

type SmokeProps = {};

export default class Smoke extends Component<SmokeProps> {
  protected template: Template = [
    {
      component: new AnimatedSprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): AnimatedSpriteProps => {
        return {
          width: 128,
          height: 128,
          spriteWidth: 16,
          spriteHeight: 16,
          interval: 120,
          source: smokeSprites
        };
      }
    }
  ];
}

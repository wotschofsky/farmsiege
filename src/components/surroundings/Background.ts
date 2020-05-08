import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import Pattern, { PatternProps } from '../../../lib/components/native/Pattern';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

import grass from '../../assets/grass.png';
import sky from '../../assets/sky/sky.png';

export type BackgroundProps = {};

export default class Background extends Component<BackgroundProps> {
  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, -400),
      props: (): SpriteProps => ({
        source: sky,
        width: 1600,
        height: 800
      })
    },
    {
      component: new Pattern(),
      position: (): Coordinates => new Coordinates(0, 176),
      props: (): PatternProps => ({
        source: grass,
        tileWidth: 128,
        tileHeight: 128,
        width: 1600,
        height: 1024,
        mode: 'repeat'
      })
    }
  ];
}

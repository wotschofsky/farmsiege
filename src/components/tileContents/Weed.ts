import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

import weed from '../../assets/plants/weed.png';

export type WeedProps = {};

export default class Weed extends Component<WeedProps> {
  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => ({
        width: 128,
        height: 128,
        source: weed
      })
    }
  ];
}

import Component from '../../lib/Component';
import { Template } from '../../lib/Types';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';
import Coordinates from '../../lib/helpers/Coordinates';

import logo from '../assets/logo.png';

export type LogoProps = {};

export default class Logo extends Component<LogoProps> {
  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => ({
        source: logo,
        width: 712,
        height: 296
      })
    }
  ];
}

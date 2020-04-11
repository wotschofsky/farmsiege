import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';
import PropsContext from '../../lib/PropsContext';

import moleSprite from '../assets/mole.png'
import molehillSprite from '../assets/molehill.png'

export type MolehillProps = {
  moleVisible?: boolean;
};

export default class Molehill extends Component<MolehillProps> {
  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<MolehillProps>): SpriteProps => ({
        source: ctx.props.moleVisible ? moleSprite : molehillSprite,
        width: 128,
        height: 128
      })
    }
  ];
}

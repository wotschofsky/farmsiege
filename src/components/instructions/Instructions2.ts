import Component from '../../../lib/Component';
import { Template } from '../../../lib/Types';
import Coordinates from '../../../lib/helpers/Coordinates';
import Text, { TextProps } from '../../../lib/components/native/Text';
import Character, { CharacterProps } from '../character/Character';
import { Directions } from '../../../lib/Enums';
import PropsContext from '../../../lib/PropsContext';

export type Instructions2Props = {};

export default class Instructions2 extends Component<Instructions2Props> {
  onTick(ctx: PropsContext<Instructions2>, timeDifference: number): void {

  }

  protected template: Template = [
    {
      component: new Character(),
      position: (): Coordinates => new Coordinates(125, 0),
      props: (): CharacterProps => ({
        direction: Directions.Right
      })
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: 'Press Space to clear the selected field (also harvesting crops)',
        color: '#fff'
      })
    }
  ];
}

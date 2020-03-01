import Component from '../../../lib/Component';
import { Template } from '../../../lib/Types';
import Coordinates from '../../../lib/helpers/Coordinates';
import Text, { TextProps } from '../../../lib/components/native/Text';
import Character, { CharacterProps } from '../character/Character';
import { Directions } from '../../../lib/Enums';
import PropsContext from '../../../lib/PropsContext';

export type Instructions3Props = {};

export default class Instructions3 extends Component<Instructions3Props> {
  private timer = 0;

  onTick(ctx: PropsContext<Instructions3>, timeDifference: number): void {
    this.timer += timeDifference;
  }

  private get showPlant() {
    return this.timer % 2000 < 1000;
  }

  private get showScore() {
    return this.timer % 2000 >= 1000;
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
      position: (): Coordinates => new Coordinates(200, 215),
      props: (): TextProps => ({
        text: '(Plant here)',
        color: '#fff'
      }),
      show: (): boolean => this.showPlant
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(300, 100),
      props: (): TextProps => ({
        text: '+10',
        color: '#fff',
        size: 36
      }),
      show: (): boolean => this.showScore
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: 'Press Space or B to clear the selected field (also harvesting crops)',
        color: '#fff'
      })
    }
  ];
}

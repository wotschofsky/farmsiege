import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Rectangle, { RectangleProps } from '../../lib/components/native/Rectangle';
import Text, { TextProps } from '../../lib/components/native/Text';

import StatsStore from '../store/StatsStore';

export type ScoreCounterProps = {};

export default class ScoreCounter extends Component<ScoreCounterProps> {
  protected template: Template = [
    // Background
    {
      component: new Rectangle(),
      position: (): Coordinates => new Coordinates(-75, 0),
      props: (): RectangleProps => ({
        width: 150,
        height: 50,
        color: 'rgba(0, 0, 0, 0.5)'
      })
    },

    // Score
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(2, 30),
      props: (): TextProps => {
        const statsStore = <StatsStore>this.stores.score;

        return {
          text: `${statsStore.content.score} Points`,
          align: 'center',
          color: '#fff',
          font: 'Heartbit',
          size: 32
        };
      }
    }
  ];
}

import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import Text, { TextProps } from '../../../lib/components/native/Text';

export type Instructions10Props = {};

export default class Instructions10 extends Component<Instructions10Props> {
  protected template: Template = [
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 100),
      props: (): TextProps => ({
        text: 'Are you ready?',
        color: '#fff',
        size: 24
      })
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 132),
      props: (): TextProps => ({
        text: 'Now protect your plants and get as many points as you can!',
        color: '#fff',
        font: 'Heartbit',
        size: 24
      })
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 132),
      props: (): TextProps => ({
        text: `The game ends once you don't have any plants left!`,
        color: '#fff',
        size: 24
      })
    }
  ];
}

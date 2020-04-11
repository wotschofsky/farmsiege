import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import Text, { TextProps } from '../../../lib/components/native/Text';

export type Instructions10Props = {};

export default class Instructions10 extends Component<Instructions10Props> {
  protected template: Template = [
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: 'Are you ready?',
        color: '#fff',
        font: 'Heartbit',
        size: 40
      })
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 82),
      props: (): TextProps => ({
        text: 'Now protect your plants and get as',
        color: '#fff',
        font: 'Heartbit',
        size: 40
      })
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 114),
      props: (): TextProps => ({
        text: 'many points as you can!',
        color: '#fff',
        font: 'Heartbit',
        size: 40
      })
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 142),
      props: (): TextProps => ({
        text: `The game ends once you don't have`,
        color: '#fff',
        font: 'Heartbit',
        size: 40
      })
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 174),
      props: (): TextProps => ({
        text: 'any plants left!',
        color: '#fff',
        font: 'Heartbit',
        size: 40
      })
    }
  ];
}

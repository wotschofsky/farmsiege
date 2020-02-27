import Component from '../../../lib/Component';
import { Template } from '../../../lib/Types';
import Coordinates from '../../../lib/helpers/Coordinates';

import Clouds from '../Clouds';
import TreesLeft from './trees/TreesLeft';
import TreesRight from './trees/TreesRight';

export type ForegroundProps = {};

export default class Foreground extends Component<ForegroundProps> {
  protected template: Template = [
    {
      position: (): Coordinates => new Coordinates(0, 0),
      component: new TreesLeft()
    },
    {
      position: (): Coordinates => new Coordinates(0, 0),
      component: new TreesRight()
    },
    {
      position: (): Coordinates => new Coordinates(0, 0),
      component: new Clouds()
    }
  ];
}

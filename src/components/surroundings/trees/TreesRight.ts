import Component from '../../../../lib/Component';
import { Template } from '../../../../lib/Types';
import Sprite, { SpriteProps } from '../../../../lib/components/native/Sprite';
import Coordinates from '../../../../lib/helpers/Coordinates';

import tree1 from '../../../assets/trees/tree_1.png';
import tree2 from '../../../assets/trees/tree_2.png';
import tree3 from '../../../assets/trees/tree_3.png';

export type TreesRightProps = {}

export default class TreesRight extends Component<TreesRightProps> {
  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(1320, 80),
      props: (): SpriteProps => ({
        source: tree1,
        width: 300,
        height: 300
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(1270, 290),
      props: (): SpriteProps => ({
        source: tree1,
        width: 300,
        height: 300
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(1350, 500),
      props: (): SpriteProps => ({
        source: tree2,
        width: 300,
        height: 300
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(1330, 720),
      props: (): SpriteProps => ({
        source: tree1,
        width: 300,
        height: 300
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(1325, 950),
      props: (): SpriteProps => ({
        source: tree2,
        width: 300,
        height: 300
      })
    }
  ];
}

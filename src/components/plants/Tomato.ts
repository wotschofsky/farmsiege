import Component from '../../../lib/Component';
import { Template } from '../../../lib/Types';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';
import Coordinates from '../../../lib/helpers/Coordinates';

import tomato0 from '../../assets/plants/tomato_0.png';
import tomato1 from '../../assets/plants/tomato_1.png';
import tomato2 from '../../assets/plants/tomato_2.png';
import tomato3 from '../../assets/plants/tomato_3.png';
import PropsContext from '../../../lib/PropsContext';

export type TomatoProps = {
  age: 0 | 1 | 2 | 3;
};

export default class Tomatom extends Component<TomatoProps> {
  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<TomatoProps>): SpriteProps => {
        let source;

        switch (ctx.props.age) {
          case 0:
            source = tomato0;
            break;
          case 1:
            source = tomato1;
            break;
          case 2:
            source = tomato2;
            break;
          case 3:
            source = tomato3;
            break;
        }

        return {
          width: 128,
          height: 128,
          source
        };
      }
    }
  ];
}

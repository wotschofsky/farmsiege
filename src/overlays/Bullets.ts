import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Rectangle, { RectangleProps } from '../../lib/components/native/Rectangle';
import Repeating, { RepeatingProps } from '../../lib/components/logical/Repeating';

import BulletData from '../store/models/BulletData';
import CharacterStore from '../store/CharacterStore';

export type BulletsProps = {};

export default class Bullets extends Component<BulletsProps> {
  protected template: Template = [
    {
      component: new Repeating(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): RepeatingProps => {
        const characterStore = <CharacterStore>this.stores.character;

        return {
          list: characterStore.content.bullets,
          component: (): Rectangle => new Rectangle(),
          position: (data: BulletData): Coordinates => new Coordinates(data.x, data.y),
          props: (): RectangleProps => ({
            color: '#000',
            width: 12,
            height: 12
          })
        };
      }
    }
  ];
}

import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

import CosmeticsStore from '../../store/CosmeticsStore';

import values from '../../values.json';

type HatProps = {};

export default class Shirt extends Component<HatProps> {
  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => {
        const cosmeticsStore = <CosmeticsStore>this.stores.cosmetics;
        return {
          width: 128 * values.character.size,
          height: 128 * values.character.size,
          source: cosmeticsStore.activeShirt.sprite
        };
      }
    }
  ];
}

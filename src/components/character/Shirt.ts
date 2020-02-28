import Component from '../../../lib/Component';
import { Template } from '../../../lib/Types';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';
import Coordinates from '../../../lib/helpers/Coordinates';

import CosmeticsStore, { Shirts } from '../../store/CosmeticsStore';
import values from '../../values.json';

type HatProps = {};

export default class Shirt extends Component<HatProps> {
  private lastShirt: Shirts;
  private shirtSprite: string;

  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => {
        const cosmeticsStore = this.stores.cosmetics as CosmeticsStore;

        if (cosmeticsStore.content.shirt !== this.lastShirt) {
          this.lastShirt = cosmeticsStore.content.shirt;
          this.shirtSprite = cosmeticsStore.activeShirt.sprite;
        }

        return {
          width: 128 * values.character.size,
          height: 128 * values.character.size,
          source: this.shirtSprite
        };
      }
    }
  ];
}

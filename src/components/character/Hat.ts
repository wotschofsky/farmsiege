import Component from '../../../lib/Component';
import { Template } from '../../../lib/Types';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';
import Coordinates from '../../../lib/helpers/Coordinates';

import CosmeticsStore, { Hats } from '../../store/CosmeticsStore';
import values from '../../values.json';

type HatProps = {};

export default class Hat extends Component<HatProps> {
  private lastHat: Hats;
  private hatSprite: string;

  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => {
        const cosmeticsStore = this.stores.cosmetics as CosmeticsStore;

        if (cosmeticsStore.content.hat !== this.lastHat) {
          this.lastHat = cosmeticsStore.content.hat;
          this.hatSprite = cosmeticsStore.activeHat.sprite;
        }

        return {
          width: 128 * values.character.size,
          height: 128 * values.character.size,
          source: this.hatSprite
        };
      }
    }
  ];
}

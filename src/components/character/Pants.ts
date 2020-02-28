import Component from '../../../lib/Component';
import { Template } from '../../../lib/Types';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';
import Coordinates from '../../../lib/helpers/Coordinates';

import CosmeticsStore, { Pants as PantsTypes } from '../../store/CosmeticsStore';
import values from '../../values.json';

type HatProps = {};

export default class Pants extends Component<HatProps> {
  private lastPants: PantsTypes;
  private pantsSprite: string;

  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => {
        const cosmeticsStore = this.stores.cosmetics as CosmeticsStore;

        if (cosmeticsStore.content.pants !== this.lastPants) {
          this.lastPants = cosmeticsStore.content.pants;
          this.pantsSprite = cosmeticsStore.activePants.sprite;
        }

        return {
          width: 128 * values.character.size,
          height: 128 * values.character.size,
          source: this.pantsSprite
        };
      }
    }
  ];
}

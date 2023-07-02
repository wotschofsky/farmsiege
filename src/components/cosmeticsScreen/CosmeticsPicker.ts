import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import Dimensions from '../../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../../lib/components/logical/EventListener';
import Repeating, { RepeatingProps } from '../../../lib/components/logical/Repeating';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

import CosmeticsStore, {
  CosmeticsTypes,
  HatData,
  hatsData,
  PantsData,
  pantsData,
  ShirtData,
  shirtsData
} from '../../store/CosmeticsStore';

import CosmeticsTypePicker, { CosmeticsTypePickerProps } from './CosmeticsTypePicker';

import xIconSprite from '../../assets/ui/icons/x.png';

export type CosmeticsPickerProps = {};

export default class CosmeticsPicker extends Component<CosmeticsPickerProps> {
  private active: CosmeticsTypes = 'shirt';

  private get activeList(): HatData[] | ShirtData[] | PantsData[] {
    switch (this.active) {
      case 'hat':
        return hatsData;
      case 'shirt':
        return shirtsData;
      case 'pants':
        return pantsData;
    }
  }

  // Calculate x position of the leftmost element
  private calculateXOffset(count: number): number {
    return -(128 * count) / 2 + 300;
  }

  protected template: Template = [
    // Type Icons
    {
      component: new CosmeticsTypePicker(),
      position: (): Coordinates => new Coordinates(300 - 120, 0),
      props: (): CosmeticsTypePickerProps => ({
        callback: (selected: CosmeticsTypes): void => {
          this.active = selected;
        }
      })
    },

    // Sprites
    {
      component: new Repeating(),
      position: (): Coordinates => new Coordinates(0, 96),
      props: (): RepeatingProps => ({
        list: this.activeList,
        component: (): Sprite => new Sprite(),
        position: (data: ShirtData, index: number): Coordinates =>
          new Coordinates(
            index * 128 + (data.sprite ? 0 : 28) + this.calculateXOffset(this.activeList.length),
            data.sprite ? 0 : 28
          ),
        props: (data: ShirtData): SpriteProps => ({
          // Use xIconSprite as sprite for option "None"
          source: data.sprite || xIconSprite,
          width: data.sprite ? 128 : 72,
          height: data.sprite ? 128 : 72
        })
      })
    },

    // Click Listeners
    {
      component: new Repeating(),
      position: (): Coordinates => new Coordinates(0, 96),
      props: (): RepeatingProps => ({
        list: this.activeList,
        component: (): EventListener => new EventListener(),
        position: (data: HatData | ShirtData | PantsData, index: number): Coordinates =>
          new Coordinates(index * 128 + this.calculateXOffset(this.activeList.length), 0),
        props: (data: HatData | ShirtData | PantsData): EventListenerProps => ({
          size: new Dimensions(128, 128),
          onClick: (): void => {
            const cosmeticsStore = <CosmeticsStore>this.stores.cosmetics;

            // Save changes in CosmeticsStore
            switch (this.active) {
              case 'hat':
                cosmeticsStore.setHat((<HatData>data).id);
                break;
              case 'shirt':
                cosmeticsStore.setShirt((<ShirtData>data).id);
                break;
              case 'pants':
                cosmeticsStore.setPants((<PantsData>data).id);
                break;
            }
          }
        })
      })
    }
  ];
}

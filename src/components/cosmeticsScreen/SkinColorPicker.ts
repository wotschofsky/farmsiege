import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import Dimensions from '../../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../../lib/components/logical/EventListener';
import Rectangle, { RectangleProps } from '../../../lib/components/native/Rectangle';
import Repeating, { RepeatingProps } from '../../../lib/components/logical/Repeating';

import CosmeticsStore, { SkinColors } from '../../store/CosmeticsStore';

export type SkinColorPickerProps = {};

const colors = ['#ffdbac', '#f1c27d', '#e0ac69', '#c68642', '#8d5524'];

export default class SkinColorPicker extends Component<SkinColorPickerProps> {
  private readonly tileSize = 48;

  protected template: Template = [
    {
      component: new Repeating(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): RepeatingProps => {
        return {
          list: colors,
          component: (): EventListener => new EventListener(),
          position: (_color: string, index: number): Coordinates => new Coordinates(index * (this.tileSize + 8), 0),
          props: (_color: string, index: number): EventListenerProps => ({
            size: new Dimensions(this.tileSize, this.tileSize),
            onClick: () => {
              const cosmeticsStore = <CosmeticsStore>this.stores.cosmetics;
              cosmeticsStore.setSkinColor(index + 1 as SkinColors);
            }
          })
        };
      }
    },
    {
      component: new Repeating(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): RepeatingProps => {
        return {
          list: colors,
          component: (): Rectangle => new Rectangle(),
          position: (_color: string, index: number): Coordinates => new Coordinates(index * (this.tileSize + 8), 0),
          props: (color: string): RectangleProps => ({
            color: color,
            width: this.tileSize,
            height: this.tileSize
          })
        };
      }
    }
  ];
}

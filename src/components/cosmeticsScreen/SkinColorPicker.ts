import Component from '../../../lib/Component';
import { Template } from '../../../lib/Types';
import Repeating, { RepeatingProps } from '../../../lib/components/logical/Repeating';
import Coordinates from '../../../lib/helpers/Coordinates';
import Rectangle, { RectangleProps } from '../../../lib/components/native/Rectangle';
import EventListener, { EventListenerProps } from '../../../lib/components/logical/EventListener';
import Dimensions from '../../../lib/helpers/Dimensions';
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
          position: (color: string, index: number): Coordinates => new Coordinates(index * (this.tileSize + 8), 0),
          props: (color: string, index: SkinColors): EventListenerProps => ({
            size: new Dimensions(this.tileSize, this.tileSize),
            onClick: () => {
              const cosmeticsStore = <CosmeticsStore>this.stores.cosmetics;
              cosmeticsStore.setSkinColor(index + 1);
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
          position: (color: string, index: number): Coordinates => new Coordinates(index * (this.tileSize + 8), 0),
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

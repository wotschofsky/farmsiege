import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';

import CosmeticsStore, {
  CosmeticsTypes,
} from '../../store/CosmeticsStore';
import CosmeticsTypePicker, { CosmeticsTypePickerProps } from './CosmeticsTypePicker';

export type CosmeticsPickerProps = {};

export default class CosmeticsPicker extends Component<CosmeticsPickerProps> {
  private active: CosmeticsTypes = 'shirt';

  protected template: Template = [
    {
      component: new CosmeticsTypePicker(),
      position: (): Coordinates => new Coordinates(300 - 120, 0),
      props: (): CosmeticsTypePickerProps => ({
        callback: (selected: CosmeticsTypes): void => {
          this.active = selected;
        }
      })
    }
  ];
}

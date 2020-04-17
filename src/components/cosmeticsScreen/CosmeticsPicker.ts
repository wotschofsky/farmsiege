import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import Text, { TextProps } from '../../../lib/components/native/Text';

export type CosmeticsPickerProps = {};

export default class CosmeticsPicker extends Component<CosmeticsPickerProps> {
  protected template: Template = [
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: 'CosmeticsPicker',
        color: '#fff'
      })
    }
  ];
}

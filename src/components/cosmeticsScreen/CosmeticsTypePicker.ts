import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import Dimensions from '../../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../../lib/components/logical/EventListener';
import PropsContext from '../../../lib/PropsContext';
import Sprite, { SpriteProps } from '../../../lib/components/native/Sprite';

import { CosmeticsTypes } from '../../store/CosmeticsStore';
import hatIconSprite from '../../assets/ui/icons/hat.png';
import pantsIconSprite from '../../assets/ui/icons/pants.png';
import shirtIconSprite from '../../assets/ui/icons/shirt.png';

export type CosmeticsTypePickerProps = {
  callback: (selected: CosmeticsTypes) => void;
};

export default class CosmeticsTypePicker extends Component<CosmeticsTypePickerProps> {
  protected template: Template = [
    // Pants
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SpriteProps => ({
        source: pantsIconSprite,
        width: 48,
        height: 48
      })
    },
    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<CosmeticsTypePickerProps>): EventListenerProps => ({
        size: new Dimensions(48, 48),
        onClick: ctx.props.callback.bind(null, 'pants')
      })
    },

    // Shirts
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(96, 0),
      props: (): SpriteProps => ({
        source: shirtIconSprite,
        width: 48,
        height: 48
      })
    },
    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(96, 0),
      props: (ctx: PropsContext<CosmeticsTypePickerProps>): EventListenerProps => ({
        size: new Dimensions(48, 48),
        onClick: ctx.props.callback.bind(null, 'shirt')
      })
    },

    // Hats
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(192, 0),
      props: (): SpriteProps => ({
        source: hatIconSprite,
        width: 48,
        height: 48
      })
    },
    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(192, 0),
      props: (ctx: PropsContext<CosmeticsTypePickerProps>): EventListenerProps => ({
        size: new Dimensions(48, 48),
        onClick: ctx.props.callback.bind(null, 'hat')
      })
    }
  ];
}

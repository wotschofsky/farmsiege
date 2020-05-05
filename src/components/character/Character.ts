import { Directions } from '../../../lib/Enums';
import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';

import { HoldableItems } from '../../store/CharacterStore';

import CharacterBase, { CharacterBaseProps } from './CharacterBase';
import Gun, { GunProps } from './Gun';
import Hammer, { HammerProps } from './Hammer';
import Hat from './Hat';
import Pants from './Pants';
import Shirt from './Shirt';
import Shovel, { ShovelProps } from './Shovel';

import values from '../../values.json';

export type CharacterProps = {
  direction: Directions;
  heldItem: HoldableItems;
  hammerPosition?: number;
};

export default class Character extends Component<CharacterProps> {
  protected template: Template = [
    // Körper
    {
      component: new CharacterBase(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<CharacterProps>): CharacterBaseProps => ({
        direction: ctx.props.direction
      })
    },

    // Cosmetics
    {
      component: new Pants(),
      position: (): Coordinates => new Coordinates(0, 72 * values.character.size)
    },
    {
      component: new Shirt(),
      position: (): Coordinates => new Coordinates(0, 56 * values.character.size)
    },
    {
      component: new Hat(),
      position: (): Coordinates => new Coordinates(0, -48 * values.character.size)
    },

    // Haltbare Gegenstände
    {
      component: new Gun(),
      position: (): Coordinates => new Coordinates(0, 120 * values.character.size),
      props: (ctx: PropsContext<CharacterProps>): GunProps => ({
        direction: ctx.props.direction
      }),
      show: (ctx: PropsContext<CharacterProps> | undefined): boolean =>
        !!ctx && ctx.props.heldItem === HoldableItems.Gun
    },
    {
      component: new Hammer(),
      position: (): Coordinates => new Coordinates(-80 * values.character.size, 32 * values.character.size),
      props: (ctx: PropsContext<CharacterProps>): HammerProps => ({
        position: ctx.props.hammerPosition ?? 0,
        direction: ctx.props.direction
      }),
      show: (ctx: PropsContext<CharacterProps> | undefined): boolean =>
        !!ctx && ctx.props.heldItem === HoldableItems.Hammer
    },
    {
      component: new Shovel(),
      position: (): Coordinates => new Coordinates(-80 * values.character.size, 32 * values.character.size),
      props: (ctx: PropsContext<CharacterProps>): ShovelProps => ({
        direction: ctx.props.direction
      }),
      show: (ctx: PropsContext<CharacterProps> | undefined): boolean =>
        !!ctx && ctx.props.heldItem === HoldableItems.Shovel
    }
  ];
}

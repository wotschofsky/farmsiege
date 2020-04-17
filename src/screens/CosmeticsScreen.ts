import { Directions } from '../../lib/Enums';
import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Dimensions from '../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';
import Text, { TextProps } from '../../lib/components/native/Text';

import { HoldableItems } from '../store/CharacterStore';
import Character, { CharacterProps } from '../components/character/Character';
import CosmeticsPicker from '../components/cosmeticsScreen/CosmeticsPicker';
import Dialog, { DialogProps } from '../components/Dialog';
import homeButtonSprite from '../assets/ui/home.png';
import ScreensStore from '../store/ScreensStore';
import SkinColorPicker from '../components/cosmeticsScreen/SkinColorPicker';
import values from '../values.json';

export type CosmeticsScreenProps = {};

export default class CosmeticsScreen extends Component<CosmeticsScreenProps> {
  private goBack(): void {
    const screensStore = <ScreensStore>this.stores.screens;
    screensStore.directContent.onReturn();
  }

  protected template: Template = [
    {
      component: new Dialog(),
      position: (): Coordinates => new Coordinates(500, 200),
      props: (): DialogProps => ({
        width: 600,
        height: 700
      })
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(550, 220),
      props: (): TextProps => ({
        text: 'Cosmetics',
        baseline: 'top',
        color: '#fff',
        font: 'Heartbit',
        size: 64
      })
    },
    {
      component: new CosmeticsPicker(),
      position: (): Coordinates => new Coordinates(500, 300)
    },
    {
      component: new Character(),
      position: (): Coordinates => new Coordinates(800 - 64 * values.character.size, 580),
      props: (): CharacterProps => ({
        direction: Directions.Left,
        heldItem: HoldableItems.None
      })
    },

    {
      component: new SkinColorPicker(),
      position: (): Coordinates => new Coordinates(664, 825)
    },

    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(650, 900),
      props: (): EventListenerProps => ({
        size: new Dimensions(300, 200),
        onClick: this.goBack
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(650, 900),
      props: (): SpriteProps => ({
        source: homeButtonSprite,
        width: 300,
        height: 200
      })
    }
  ];
}

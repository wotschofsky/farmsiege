import { Directions } from '../../lib/Enums';
import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Dimensions from '../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';
import Text, { TextProps } from '../../lib/components/native/Text';

import { HoldableItems } from '../store/CharacterStore';
import backButtonSprite from '../assets/ui/retry.png';
import Character, { CharacterProps } from '../components/character/Character';
import CosmeticsStore from '../store/CosmeticsStore';
import Dialog, { DialogProps } from '../components/Dialog';
import ScreensStore from '../store/ScreensStore';
import values from '../values.json';

export type CosmeticsScreenProps = {};

export default class CosmeticsScreen extends Component<CosmeticsScreenProps> {
  private changeHat(): void {
    const cosmeticsStore = <CosmeticsStore>this.stores.cosmetics;
    cosmeticsStore.rotateHat();
  }

  private changeShirt(): void {
    const cosmeticsStore = <CosmeticsStore>this.stores.cosmetics;
    cosmeticsStore.rotateShirt();
  }

  private changePants(): void {
    const cosmeticsStore = <CosmeticsStore>this.stores.cosmetics;
    cosmeticsStore.rotatePants();
  }

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
      position: (): Coordinates => new Coordinates(800, 875),
      props: (): TextProps => ({
        text: 'Click on a part of the character to change it',
        align: 'center',
        baseline: 'bottom',
        color: '#fff',
        font: 'Heartbit',
        size: 40
      })
    },
    {
      component: new Character(),
      position: (): Coordinates => new Coordinates(800 - 64 * values.character.size, 600),
      props: (): CharacterProps => ({
        direction: Directions.Left,
        heldItem: HoldableItems.None
      })
    },

    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(800 - 64 * values.character.size, 600 - 16 * values.character.size),
      props: (): EventListenerProps => ({
        size: new Dimensions(128 * values.character.size, 64 * values.character.size),
        onClick: this.changeHat
      })
    },

    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(800 - 64 * values.character.size, 600 + 88 * values.character.size),
      props: (): EventListenerProps => ({
        size: new Dimensions(128 * values.character.size, 56 * values.character.size),
        onClick: this.changeShirt
      })
    },

    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(800 - 64 * values.character.size, 600 + 144 * values.character.size),
      props: (): EventListenerProps => ({
        size: new Dimensions(128 * values.character.size, 32 * values.character.size),
        onClick: this.changePants
      })
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
        source: backButtonSprite,
        width: 300,
        height: 200
      })
    }
  ];
}

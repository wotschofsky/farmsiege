import { Directions } from '../../lib/Enums';
import { Template } from '../../lib/Types';
import Character, { CharacterProps } from '../components/character/Character';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import CosmeticsStore from '../store/CosmeticsStore';
import Dimensions from '../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';
import Text, { TextProps } from '../../lib/components/native/Text';

import backButtonSprite from '../assets/ui/retry.png';
import ScreensStore from '../store/ScreensStore';
import values from '../values.json';

export type CosmeticsScreenProps = {};

export default class CosmeticsScreen extends Component<CosmeticsScreenProps> {
  private changeHat(): void {
    const cosmeticsStore = this.stores.cosmetics as CosmeticsStore;
    cosmeticsStore.rotateHat();
  }

  private goBack(): void {
    const screensStore = this.stores.screens as ScreensStore;
    screensStore.directContent.onReturn();
  }

  protected template: Template = [
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(480, 500),
      props: (): TextProps => ({
        text: 'Click on a part of the character to change it',
        color: '#fff',
        size: 32
      })
    },
    {
      component: new Character(),
      position: (): Coordinates => new Coordinates(800 - 64 * values.character.size, 600),
      props: (): CharacterProps => ({
        direction: Directions.Left
      })
    },
    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(800 - 64 * values.character.size, 600),
      props: (): EventListenerProps => ({
        size: new Dimensions(128 * values.character.size, 128 * values.character.size),
        onClick: this.changeHat
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

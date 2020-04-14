import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Dimensions from '../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';
import Text, { TextProps } from '../../lib/components/native/Text';

import Dialog, { DialogProps } from '../components/Dialog';
import ScreensStore from '../store/ScreensStore';
import homeButtonSprite from '../assets/ui/home.png';

export type CreditsScreenProps = {};

export default class CreditsScreen extends Component<CreditsScreenProps> {
  private goBack(): void {
    const screensStore = <ScreensStore>this.stores.screens;
    screensStore.content.onReturn();
  }

  protected template: Template = [
    {
      component: new Dialog(),
      position: (): Coordinates => new Coordinates(500, 200),
      props: (): DialogProps => ({
        width: 600,
        height: 600
      })
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(550, 350),
      props: (): TextProps => ({
        text: 'Credits',
        color: '#fff',
        font: 'Heartbit',
        size: 64
      })
    },

    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(500, 900),
      props: (): EventListenerProps => ({
        size: new Dimensions(300, 200),
        onClick: this.goBack
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(500, 900),
      props: (): SpriteProps => ({
        source: homeButtonSprite,
        width: 300,
        height: 200
      })
    }
  ];
}

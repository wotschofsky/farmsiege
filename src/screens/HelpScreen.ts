import Component from '../../lib/Component';
import { Template } from '../../lib/Types';
import Dialog, { DialogProps } from '../components/Dialog';
import Coordinates from '../../lib/helpers/Coordinates';
import Text, { TextProps } from '../../lib/components/native/Text';
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener';
import Dimensions from '../../lib/helpers/Dimensions';
import ScreensStore from '../store/ScreensStore';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';

import backButtonSprite from '../assets/ui/back.png';
import forwardButtonSprite from '../assets/ui/forward.png';
import Instructions1 from '../components/instructions/Instructions1';
import Instructions2 from '../components/instructions/Instructions2';
import Instructions3 from '../components/instructions/Instructions3';
import Instructions4 from '../components/instructions/Instructions4';
import Instructions5 from '../components/instructions/Instructions5';

export type HelpScreenProps = {};

export default class HelpScreen extends Component<HelpScreenProps> {
  private totalPages = 5;
  private currentPage = 1;

  private goBack(): void {
    if (this.currentPage === 1) {
      const screensStore = <ScreensStore>this.stores.screens;
      screensStore.directContent.onReturn();
      return;
    }
    this.currentPage--;
  }

  private continue(): void {
    if (this.currentPage === this.totalPages) {
      const screensStore = <ScreensStore>this.stores.screens;
      screensStore.directContent.onReturn();
      return;
    }
    this.currentPage++;
  }

  protected template: Template = [
    {
      component: new Dialog(),
      position: (): Coordinates => new Coordinates(500, 400),
      props: (): DialogProps => ({
        width: 600,
        height: 400
      })
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(500 + 50, 400 + 75),
      props: (): TextProps => ({
        text: 'HOW TO PLAY',
        color: '#fff',
        size: 36
      })
    },

    {
      component: new Instructions1(),
      position: (): Coordinates => new Coordinates(500 + 50, 400 + 125),
      show: (): boolean => this.currentPage === 1
    },
    {
      component: new Instructions2(),
      position: (): Coordinates => new Coordinates(500 + 50, 400 + 125),
      show: (): boolean => this.currentPage === 2
    },
    {
      component: new Instructions3(),
      position: (): Coordinates => new Coordinates(500 + 50, 400 + 125),
      show: (): boolean => this.currentPage === 3
    },
    {
      component: new Instructions4(),
      position: (): Coordinates => new Coordinates(500 + 50, 400 + 125),
      show: (): boolean => this.currentPage === 4
    },
    {
      component: new Instructions5(),
      position: (): Coordinates => new Coordinates(500 + 50, 400 + 125),
      show: (): boolean => this.currentPage === 5
    },

    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(500 + 280, 400 + 375),
      props: (): TextProps => ({
        text: `${this.currentPage} / ${this.totalPages}`,
        color: '#fff'
      })
    },

    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(500, 900),
      props: (): EventListenerProps => ({
        size: new Dimensions(300, 200),
        onClick: this.goBack.bind(this)
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(500, 900),
      props: (): SpriteProps => ({
        source: backButtonSprite,
        width: 300,
        height: 200
      })
    },

    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(800, 900),
      props: (): EventListenerProps => ({
        size: new Dimensions(300, 200),
        onClick: this.continue.bind(this)
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(800, 900),
      props: (): SpriteProps => ({
        source: forwardButtonSprite,
        width: 300,
        height: 200
      })
    }
  ];
}

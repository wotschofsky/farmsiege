import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Dialog, { DialogProps } from '../components/Dialog';
import Dimensions from '../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';
import Text, { TextProps } from '../../lib/components/native/Text';

import ScreensStore from '../store/ScreensStore';
import MiscStore from '../store/MiscStore';
import backButtonSprite from '../assets/ui/back.png';
import forwardButtonSprite from '../assets/ui/forward.png';
import homeButtonSprite from '../assets/ui/home.png';
import playButtonSprite from '../assets/ui/play.png';
import Instructions1 from '../components/instructions/Instructions1';
import Instructions2 from '../components/instructions/Instructions2';
import Instructions3 from '../components/instructions/Instructions3';
import Instructions4 from '../components/instructions/Instructions4';
import Instructions5 from '../components/instructions/Instructions5';
import Instructions6 from '../components/instructions/Instructions6';
import Instructions7 from '../components/instructions/Instructions7';
import Instructions8 from '../components/instructions/Instructions8';
import Instructions9 from '../components/instructions/Instructions9';
import Instructions10 from '../components/instructions/Instructions10';

export type HelpScreenProps = {};

export default class HelpScreen extends Component<HelpScreenProps> {
  private totalPages = 10;

  private get currentPage(): number {
    const miscStore = <MiscStore>this.stores.misc;
    return miscStore.content.instructionsPage;
  }

  private set currentPage(value: number) {
    const miscStore = <MiscStore>this.stores.misc;
    miscStore.changeInstructionsPage(value);
  }

  private goBack(): void {
    if (this.currentPage === 1) {
      const screensStore = <ScreensStore>this.stores.screens;
      screensStore.content.onReturn();
      return;
    }
    this.currentPage--;
  }

  private continue(): void {
    if (this.currentPage === this.totalPages) {
      const screensStore = <ScreensStore>this.stores.screens;
      screensStore.content.onReturn();
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
        font: 'Heartbit',
        size: 64
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
      component: new Instructions6(),
      position: (): Coordinates => new Coordinates(500 + 50, 400 + 125),
      show: (): boolean => this.currentPage === 6
    },
    {
      component: new Instructions7(),
      position: (): Coordinates => new Coordinates(500 + 50, 400 + 125),
      show: (): boolean => this.currentPage === 7
    },
    {
      component: new Instructions8(),
      position: (): Coordinates => new Coordinates(500 + 50, 400 + 125),
      show: (): boolean => this.currentPage === 8
    },
    {
      component: new Instructions9(),
      position: (): Coordinates => new Coordinates(500 + 50, 400 + 125),
      show: (): boolean => this.currentPage === 9
    },
    {
      component: new Instructions10(),
      position: (): Coordinates => new Coordinates(500 + 50, 400 + 125),
      show: (): boolean => this.currentPage === 10
    },

    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(500 + 280, 400 + 375),
      props: (): TextProps => ({
        text: `${this.currentPage} / ${this.totalPages}`,
        color: '#fff',
        font: 'Heartbit',
        size: 32
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
      }),
      show: (): boolean => this.currentPage !== 1
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(500, 900),
      props: (): SpriteProps => ({
        source: homeButtonSprite,
        width: 300,
        height: 200
      }),
      show: (): boolean => this.currentPage === 1
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
      }),
      show: (): boolean => this.currentPage !== this.totalPages
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(800, 900),
      props: (): SpriteProps => {
        const miscStore = <MiscStore>this.stores.misc;

        let sprite: string;
        switch (miscStore.content.instructionsMode) {
          case 'manual':
            sprite = homeButtonSprite;
            break;
          case 'beforeGame':
            sprite = playButtonSprite;
            break;
        }

        return {
          source: sprite,
          width: 300,
          height: 200
        };
      },
      show: (): boolean => this.currentPage === this.totalPages
    }
  ];
}

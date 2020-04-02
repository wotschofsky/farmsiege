import Cookie from 'js-cookie';

import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Dimensions from '../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';

import CharacterStore from '../store/CharacterStore';
import EffectsStore from '../store/EffectsStore';
import GridStore from '../store/GridStore';
import logo from '../assets/logo.png';
import MovablesStore from '../store/MovablesStore';
import ScreensStore, { Screens } from '../store/ScreensStore';
import StatsStore from '../store/StatsStore';
import playButtonSprite from '../assets/ui/play.png';
import helpButtonSprite from '../assets/ui/help.png';
import cosmeticsButtonSprite from '../assets/ui/cosmetics.png';

export type StartScreenProps = {};

export default class StartScreen extends Component<StartScreenProps> {
  private startGame(): void {
    const gridStore = <GridStore>this.stores.grid;
    gridStore.reset();

    const movablesStore = <MovablesStore>this.stores.movables;
    movablesStore.reset();

    const screensStore = <ScreensStore>this.stores.screens;
    if (Cookie.getJSON('helpShown')) {
      gridStore.start();
      movablesStore.start();
      screensStore.setScreen(Screens.Game);
    } else {
      screensStore.setScreen(Screens.Help);
      screensStore.setOnReturn(() => {
        gridStore.start();
        movablesStore.start();
        screensStore.setScreen(Screens.Game);
      });
      Cookie.set('helpShown', 'true');
    }

    const characterStore = <CharacterStore>this.stores.character;
    characterStore.reset();

    const statsStore = <StatsStore>this.stores.score;
    statsStore.reset();

    const effectsStore = <EffectsStore>this.stores.effects;
    effectsStore.reset();
  }

  private showHelp(): void {
    const screensStore = <ScreensStore>this.stores.screens;
    screensStore.setScreen(Screens.Help);
    screensStore.setOnReturn(() => {
      screensStore.setScreen(Screens.Start);
    });
  }

  private showCosmetics(): void {
    const screensStore = <ScreensStore>this.stores.screens;
    screensStore.setScreen(Screens.Cosmetics);
    screensStore.setOnReturn(() => {
      screensStore.setScreen(Screens.Start);
    });
  }

  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(444, 150),
      props: (): SpriteProps => ({
        source: logo,
        width: 712,
        height: 296
      })
    },
    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(650, 500),
      props: (): EventListenerProps => ({
        size: new Dimensions(300, 200),
        onClick: this.startGame
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(650, 500),
      props: (): SpriteProps => ({
        source: playButtonSprite,
        width: 300,
        height: 200
      })
    },
    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(650, 700),
      props: (): EventListenerProps => ({
        size: new Dimensions(300, 200),
        onClick: this.showHelp
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(650, 700),
      props: (): SpriteProps => ({
        source: helpButtonSprite,
        width: 300,
        height: 200
      })
    },
    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(650, 900),
      props: (): EventListenerProps => ({
        size: new Dimensions(300, 200),
        onClick: this.showCosmetics
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(650, 900),
      props: (): SpriteProps => ({
        source: cosmeticsButtonSprite,
        width: 300,
        height: 200
      })
    }
  ];
}

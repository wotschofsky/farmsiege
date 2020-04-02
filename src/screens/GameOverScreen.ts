import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Dimensions from '../../lib/helpers/Dimensions';
import EventListener, { EventListenerProps } from '../../lib/components/logical/EventListener';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';
import Text, { TextProps } from '../../lib/components/native/Text';

import CharacterStore from '../store/CharacterStore';
import Dialog, { DialogProps } from '../components/Dialog';
import EffectsStore from '../store/EffectsStore';
import GridStore from '../store/GridStore';
import Highscores from '../components/Highscores';
import MovablesStore from '../store/MovablesStore';
import ScreensStore, { Screens } from '../store/ScreensStore';
import StatsStore from '../store/StatsStore';
import playButtonSprite from '../assets/ui/play.png';
import homeButtonSprite from '../assets/ui/home.png';

export type GameOverScreenProps = {};

export default class GameOverScreen extends Component<GameOverScreenProps> {
  private startGame(): void {
    const screensStore = <ScreensStore>this.stores.screens;
    screensStore.setScreen(Screens.Game);

    const gridStore = <GridStore>this.stores.grid;
    gridStore.start();

    const movablesStore = <MovablesStore>this.stores.movables;
    movablesStore.start();

    const characterStore = <CharacterStore>this.stores.character;
    characterStore.reset();

    const statsStore = <StatsStore>this.stores.score;
    statsStore.reset();

    const effectsStore = <EffectsStore>this.stores.effects;
    effectsStore.reset();
  }

  private goBack(): void {
    const screensStore = <ScreensStore>this.stores.screens;
    screensStore.setScreen(Screens.Start);
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
      props: (): TextProps => {
        const statsStore = <StatsStore>this.stores.score;
        return {
          text: `YOUR SCORE: ${statsStore.content.score}`,
          color: '#fff',
          size: 36
        };
      }
    },

    {
      component: new Highscores(),
      position: (): Coordinates => new Coordinates(550, 420)
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
    },

    {
      component: new EventListener(),
      position: (): Coordinates => new Coordinates(800, 900),
      props: (): EventListenerProps => ({
        size: new Dimensions(300, 200),
        onClick: this.startGame
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(800, 900),
      props: (): SpriteProps => ({
        source: playButtonSprite,
        width: 300,
        height: 200
      })
    }
  ];
}

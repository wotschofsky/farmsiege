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
import homeButtonSprite from '../assets/ui/home.png';
import Input, { InputProps } from '../components/Input';
import MiscStore from '../store/MiscStore';
import MovablesStore from '../store/MovablesStore';
import playButtonSprite from '../assets/ui/play.png';
import ScreensStore, { Screens } from '../store/ScreensStore';
import StatsStore from '../store/StatsStore';

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

  private async submitScore(name: string): Promise<void> {
    const miscStore = <MiscStore>this.stores.misc;
    const statsStore = <StatsStore>this.stores.score;

    const score = statsStore.content.score;

    if (
      score <= 0 ||
      name.trim().length < 1 ||
      statsStore.content.scoreSubmitted ||
      !miscStore.content.recaptchaLoaded
    ) {
      return;
    }

    statsStore.setScoreSubmitted(true);

    try {
      const recaptchaToken = await grecaptcha.execute('6Ld27OwUAAAAAHRFNi9oKmJx2jQCj81Z6iuJjUQW', {
        action: 'highscore'
      });

      await fetch('/api/submitScore', {
        method: 'POST',
        body: JSON.stringify({
          score: score,
          name: name.trim().slice(0, 22),
          recaptcha: recaptchaToken
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch {
      statsStore.setScoreSubmitted(false);
    }

    const highscores = miscStore.content.highscores;
    if (highscores[highscores.length - 1].score < score) {
      miscStore.fetchHighscores();
    }
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
      position: (): Coordinates => new Coordinates(550, 220),
      props: (): TextProps => {
        const statsStore = <StatsStore>this.stores.score;
        return {
          text: `YOUR SCORE: ${statsStore.content.score}`,
          baseline: 'top',
          color: '#fff',
          font: 'Heartbit',
          size: 64
        };
      }
    },

    {
      component: new Input(),
      position: (): Coordinates => new Coordinates(550, 300),
      props: (): InputProps => ({
        width: 500,
        maxLength: 22,
        placeholder: 'Enter your name and press "enter"',
        onEnter: this.submitScore
      }),
      show: (): boolean => {
        const statsStore = <StatsStore>this.stores.score;
        const miscStore = <MiscStore>this.stores.misc;
        return statsStore.content.score > 0 && !statsStore.content.scoreSubmitted && miscStore.content.recaptchaLoaded;
      }
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(550, 300 + 24),
      props: (): TextProps => ({
        text: 'Score submitted',
        baseline: 'middle',
        color: '#fff',
        font: 'Heartbit',
        size: 48
      }),
      show: (): boolean => {
        const statsStore = <StatsStore>this.stores.score;
        return statsStore.content.scoreSubmitted;
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
    },
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(800, 1150),
      props: (): TextProps => {
        const miscStore = <MiscStore>this.stores.misc;

        return {
          text: `Tip: ${miscStore.content.displayedTip}`,
          align: 'center',
          color: '#fff',
          font: 'Heartbit',
          size: 48
        };
      }
    }
  ];
}

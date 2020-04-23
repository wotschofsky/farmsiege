import { Template } from '../lib/Types';
import Component from '../lib/Component';
import Coordinates from '../lib/helpers/Coordinates';
import load from 'load-script';

import Background from './components/surroundings/Background';
import soundtrackMoonBase from './assets/soundtrack/moon_base.mp3';
import soundtrackThermal from './assets/soundtrack/thermal.mp3';
import MuteButton from './components/MuteButton';

import GameOverScreen from './screens/GameOverScreen';
import GameScreen from './screens/GameScreen';
import HelpScreen from './screens/HelpScreen';
import StartScreen from './screens/StartScreen';
import CosmeticsScreen from './screens/CosmeticsScreen';
import CreditsScreen from './screens/CreditsScreen';

import CharacterStore from './store/CharacterStore';
import CosmeticsStore from './store/CosmeticsStore';
import Effects from './overlays/Effects';
import EffectsStore from './store/EffectsStore';
import GridStore from './store/GridStore';
import MovablesStore from './store/MovablesStore';
import PropsContext from '../lib/PropsContext';
import StatsStore from './store/StatsStore';
import ScreensStore, { ScreensStoreContent, Screens } from './store/ScreensStore';
import SettingsStore, { SettingsStoreContent } from './store/SettingsStore';
import Foreground from './components/surroundings/Foreground';
import ScoreCounter from './components/ScoreCounter';
import GameOverEffect from './overlays/GameOverEffect';
import MiscStore from './store/MiscStore';
import SplashScreen, { SplashScreenProps } from './overlays/SplashScreen';

class Game extends Component<{}> {
  private activeScreen: Screens;
  private gameOver = false;

  protected onInit(): void {
    const settingsStore = <SettingsStore>this.stores.settings;
    const screensStore = <ScreensStore>this.stores.screens;

    const audio = new Audio(soundtrackMoonBase);
    audio.loop = true;
    audio.volume = settingsStore.content.volume * 0.8;
    audio.autoplay = true;
    audio.play().catch(() => {
      window.addEventListener(
        'click',
        () => {
          audio.play();
        },
        {
          once: true,
          passive: true
        }
      );
    });

    settingsStore.subscribe((state: SettingsStoreContent) => {
      audio.volume = state.volume * 0.8;
    });

    screensStore.subscribe((state: ScreensStoreContent) => {
      switch (state.active) {
        case Screens.Game:
          audio.src = soundtrackThermal;
          break;
        case Screens.GameOver:
          audio.src = soundtrackMoonBase;
      }
    });

    load(
      `https://www.google.com/recaptcha/api.js?render=${'6Ld27OwUAAAAAHRFNi9oKmJx2jQCj81Z6iuJjUQW'}`,
      (err: Error) => {
        if (err) {
          console.error(err);
        } else {
          grecaptcha.ready(async () => {
            const miscStore = <MiscStore>this.stores.misc;
            miscStore.setRecaptchaLoaded();
          });
        }
      }
    );
  }

  public constructor() {
    super();

    this.activeScreen = Screens.Start;

    const characterStore = new CharacterStore();
    this.registerStore(characterStore);

    const cosmeticsStore = new CosmeticsStore();
    this.registerStore(cosmeticsStore);

    const gridStore = new GridStore();
    this.registerStore(gridStore);

    const movablesStore = new MovablesStore();
    this.registerStore(movablesStore);

    const effectsStore = new EffectsStore();
    this.registerStore(effectsStore);

    const statsStore = new StatsStore();
    this.registerStore(statsStore);

    const screensStore = new ScreensStore();
    this.registerStore(screensStore);

    const settingsStore = new SettingsStore();
    this.registerStore(settingsStore);

    const miscStore = new MiscStore();
    this.registerStore(miscStore);
  }

  protected onTick(ctx: PropsContext<{}>, timeDifference: number): void {
    const screensStore = <ScreensStore>this.stores.screens;
    this.activeScreen = screensStore.content.active;

    const gridStore = <GridStore>this.stores.grid;
    const movablesStore = <MovablesStore>this.stores.movables;
    const effectsStore = <EffectsStore>this.stores.effects;

    const characterStore = <CharacterStore>this.stores.character;
    const statsStore = <StatsStore>this.stores.score;

    statsStore.increaseDuration(timeDifference);
    characterStore.updateTimer(timeDifference);

    if (gridStore.friendlyPlants === 0 && !effectsStore.directContent.gameOver.active) {
      const miscStore = <MiscStore>this.stores.misc;
      miscStore.fetchHighscores();

      effectsStore.showGameOverAnimation(new Coordinates(1000, 800), async () => {
        const score = statsStore.content.score;

        if (score > 0 && miscStore.content.recaptchaLoaded) {
          const name = prompt(`Your Score is ${score}! Please enter your name (max. 22 Characters)`, '');
          if (!!name && name.trim().length >= 1) {
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

            const highscores = miscStore.content.highscores;
            if (highscores[highscores.length - 1].score < score) {
              miscStore.fetchHighscores();
            }
          }
        }

        movablesStore.stop();
        movablesStore.reset();
        gridStore.reset();

        screensStore.setScreen(Screens.GameOver);
      });

      gridStore.stop();
    }

    // Update speedMultiplier in stores
    const { gameSpeed } = statsStore;
    gridStore.speedMultiplier = gameSpeed;
    movablesStore.speedMultiplier = gameSpeed;

    effectsStore.updateEffects(timeDifference);
  }

  protected template: Template = [
    {
      component: new Background(),
      position: (): Coordinates => new Coordinates(0, 0)
    },
    {
      component: new GameScreen(),
      position: (): Coordinates => new Coordinates(0, 0),
      show: (): boolean => this.activeScreen === Screens.Game
    },
    {
      component: new StartScreen(),
      position: (): Coordinates => new Coordinates(0, 0),
      show: (): boolean => this.activeScreen === Screens.Start
    },
    {
      component: new GameOverScreen(),
      position: (): Coordinates => new Coordinates(0, 0),
      show: (): boolean => this.activeScreen === Screens.GameOver
    },
    {
      component: new HelpScreen(),
      position: (): Coordinates => new Coordinates(0, 0),
      show: (): boolean => this.activeScreen === Screens.Help
    },
    {
      component: new CosmeticsScreen(),
      position: (): Coordinates => new Coordinates(0, 0),
      show: (): boolean => this.activeScreen === Screens.Cosmetics
    },
    {
      component: new CreditsScreen(),
      position: (): Coordinates => new Coordinates(0, 0),
      show: (): boolean => this.activeScreen === Screens.Credits
    },
    {
      component: new MuteButton(),
      position: (): Coordinates => new Coordinates(12, 8)
    },
    {
      component: new Effects(),
      position: (): Coordinates => new Coordinates(0, 0)
    },
    {
      component: new Foreground(),
      position: (): Coordinates => new Coordinates(0, 0)
    },
    {
      component: new ScoreCounter(),
      position: (): Coordinates => new Coordinates(800, 0),
      show: (): boolean => this.activeScreen === Screens.Game
    },
    {
      component: new GameOverEffect(),
      position: (): Coordinates => new Coordinates(0, 0)
    },
    {
      component: new SplashScreen(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): SplashScreenProps => ({
        finishedCallback: (): void => {
          const miscStore = <MiscStore>this.stores.misc;
          miscStore.setSplashScreenShown();
        }
      }),
      show: (): boolean => {
        const miscStore = <MiscStore>this.stores.misc;
        return miscStore.content.splashScreenShowing;
      }
    }
  ];
}

export default Game;

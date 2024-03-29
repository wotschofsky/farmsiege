import { Template } from '../lib/Types';
import Component from '../lib/Component';
import Coordinates from '../lib/helpers/Coordinates';
import load from 'load-script';
import PropsContext from '../lib/PropsContext';
import Store from '../lib/store/Store';

import CharacterStore from './store/CharacterStore';
import CosmeticsStore from './store/CosmeticsStore';
import EffectsStore from './store/EffectsStore';
import GridStore from './store/GridStore';
import MiscStore from './store/MiscStore';
import MovablesStore from './store/MovablesStore';
import ScreensStore, { ScreensStoreContent, Screens } from './store/ScreensStore';
import SettingsStore, { SettingsStoreContent } from './store/SettingsStore';
import StatsStore from './store/StatsStore';

import Background from './components/surroundings/Background';
import Foreground from './components/surroundings/Foreground';
import MuteButton from './components/MuteButton';
import ScoreCounter from './components/ScoreCounter';

import CosmeticsScreen from './screens/CosmeticsScreen';
import CreditsScreen from './screens/CreditsScreen';
import GameOverScreen from './screens/GameOverScreen';
import GameScreen from './screens/GameScreen';
import HelpScreen from './screens/HelpScreen';
import StartScreen from './screens/StartScreen';

import Effects from './overlays/Effects';
import GameOverEffect from './overlays/GameOverEffect';
import SplashScreen, { SplashScreenProps } from './overlays/SplashScreen';

import soundtrackMoonBase from './assets/soundtrack/moon_base.mp3';
import soundtrackThermal from './assets/soundtrack/thermal.mp3';

export type GameProps = {};

class Game extends Component<GameProps> {
  private activeScreen: Screens = Screens.Start;

  protected onInit(): void {
    this.initStores();

    const settingsStore = <SettingsStore>this.stores.settings;
    const screensStore = <ScreensStore>this.stores.screens;

    // Play music
    const audio = new Audio(soundtrackMoonBase);
    audio.loop = true;
    audio.volume = settingsStore.content.volume * 0.5;
    audio.autoplay = true;

    const playPromise = audio.play();
    // Ensure IE Compatibility
    if (playPromise) {
      playPromise.catch(() => {
        window.addEventListener('click', audio.play.bind(audio), {
          once: true,
          passive: true
        });
      });
    }

    // Adjust music volume on volume change
    settingsStore.subscribe((state: SettingsStoreContent) => {
      audio.volume = state.volume * 0.5;
    });

    // Switch music on game start / end
    screensStore.subscribe((state: ScreensStoreContent) => {
      switch (state.active) {
        case Screens.Game:
          audio.src = soundtrackThermal;
          break;
        case Screens.GameOver:
          audio.src = soundtrackMoonBase;
      }
    });

    // Load ReCaptcha script
    load(`https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`, (err) => {
      if (err) {
        console.error(err);
      } else {
        // When loaded, save in MiscStore
        const miscStore = <MiscStore>this.stores.misc;
        grecaptcha.ready(miscStore.setRecaptchaLoaded.bind(miscStore));
      }
    });
  }

  protected onTick(_ctx: PropsContext<{}>, timeDifference: number): void {
    const characterStore = <CharacterStore>this.stores.character;
    const effectsStore = <EffectsStore>this.stores.effects;
    const gridStore = <GridStore>this.stores.grid;
    const movablesStore = <MovablesStore>this.stores.movables;
    const screensStore = <ScreensStore>this.stores.screens;
    const statsStore = <StatsStore>this.stores.score;

    this.activeScreen = screensStore.content.active;

    statsStore.increaseDuration(timeDifference);
    characterStore.updateTimer(timeDifference);

    if (gridStore.friendlyPlants === 0 && !effectsStore.content.gameOver.active) {
      const miscStore = <MiscStore>this.stores.misc;
      miscStore.fetchHighscores();
      miscStore.updateTip();
      gridStore.stop();

      const center: Coordinates = new Coordinates(
        (gridStore.lastRemovedPlant?.x || 3.5) * 128 + 64 + 288,
        (gridStore.lastRemovedPlant?.y || 3.5) * 128 + 64 + 176
      );

      effectsStore.showGameOverAnimation(center, async () => {
        movablesStore.stop();
        movablesStore.reset();
        gridStore.reset();

        screensStore.setScreen(Screens.GameOver);
      });
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

  private initStores(): void {
    const stores: Record<string, Store<any>> = {
      character: new CharacterStore(),
      cosmetics: new CosmeticsStore(),
      grid: new GridStore(),
      movables: new MovablesStore(),
      effects: new EffectsStore(),
      score: new StatsStore(),
      screens: new ScreensStore(),
      settings: new SettingsStore(),
      misc: new MiscStore()
    };

    for (const name in stores) {
      const store = stores[name];
      this.registerStore(name, store);
    }
  }
}

export default Game;

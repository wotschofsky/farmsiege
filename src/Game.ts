import { Template } from '../lib/Types';
import Component from '../lib/Component';
import Coordinates from '../lib/helpers/Coordinates';

import Background from './components/surroundings/Background';
import soundtrackMoonBase from './assets/soundtrack/moon_base.mp3';
import soundtrackThermal from './assets/soundtrack/thermal.mp3';
import MuteButton from './components/MuteButton';

import GameOverScreen from './screens/GameOverScreen';
import GameScreen from './screens/GameScreen';
import HelpScreen from './screens/HelpScreen';
import StartScreen from './screens/StartScreen';

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
import CosmeticsScreen from './screens/CosmeticsScreen';
import Foreground from './components/surroundings/Foreground';
import ScoreCounter from './components/ScoreCounter';
import GameOverEffect from './overlays/GameOverEffect';

class Game extends Component<{}> {
  private activeScreen: Screens;

  protected onInit(): void {
    const settingsStore = <SettingsStore>this.stores.settings;
    const screensStore = <ScreensStore>this.stores.screens;

    const audio = new Audio(soundtrackMoonBase);
    audio.loop = true;
    audio.volume = settingsStore.content.music ? 0.8 : 0;
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
      audio.volume = state.music ? 0.8 : 0;
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
  }

  protected onTick(ctx: PropsContext<{}>, timeDifference: number): void {
    const screensStore = <ScreensStore>this.stores.screens;
    this.activeScreen = screensStore.content.active;

    const gridStore = <GridStore>this.stores.grid;
    const movablesStore = <MovablesStore>this.stores.movables;

    const statsStore = <StatsStore>this.stores.score;

    statsStore.increaseDuration(timeDifference);

    if (gridStore.friendlyPlants === 0 && !window.invincible) {
      const effectsStore = <EffectsStore>this.stores.effects;
      effectsStore.showGameOverAnimation(new Coordinates(1000, 800), () => {
        if (statsStore.content.score > 0) {
          const name = prompt('Please enter your name', '');
          if (!!name && name.trim().length >= 1) {
            fetch('https://garden-defense.firebaseio.com/highscores.json', {
              method: 'POST',
              body: JSON.stringify({
                score: statsStore.content.score,
                name: name.trim()
              })
            });
          }
        }

        movablesStore.stop();
        movablesStore.reset();

        screensStore.setScreen(Screens.GameOver);
      });

      gridStore.stop();
      gridStore.reset();
    }

    // Update speedMultiplier in stores
    const { gameSpeed } = statsStore;
    gridStore.speedMultiplier = gameSpeed;
    movablesStore.speedMultiplier = gameSpeed;

    const effectsStore = <EffectsStore>this.stores.effects;
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
    }
  ];
}

export default Game;

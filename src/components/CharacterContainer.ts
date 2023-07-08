import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import InputMap, { GamepadButtons, GamepadStickDirections } from '../../lib/InputMap';
import PropsContext from '../../lib/PropsContext';

import CharacterStore, { HoldableItems } from '../store/CharacterStore';
import EffectsStore from '../store/EffectsStore';
import GridStore from '../store/GridStore';
import MovablesStore from '../store/MovablesStore';
import ScreensStore, { ScreensStoreContent, Screens } from '../store/ScreensStore';
import SettingsStore from '../store/SettingsStore';
import StatsStore from '../store/StatsStore';

import Character, { CharacterProps } from './character/Character';

import shotgunSound from '../assets/sounds/shotgun.mp3';

import TileContents from '../TileContents';
import values from '../values.json';

export type CharacterContainerProps = {};

export default class CharacterContainer extends Component<CharacterContainerProps> {
  private inputMap?: InputMap;
  private nextShotAvailableAt = 0;

  private get nextShotAvailable(): boolean {
    return this.nextShotAvailableAt <= window.performance.now();
  }

  protected onInit(): void {
    this.inputMap = new InputMap({
      up: {
        keys: ['KeyW', 'ArrowUp', GamepadStickDirections.LeftStickUp]
      },
      left: {
        keys: ['KeyA', 'ArrowLeft', GamepadStickDirections.LeftStickLeft]
      },
      down: {
        keys: ['KeyS', 'ArrowDown', GamepadStickDirections.LeftStickDown]
      },
      right: {
        keys: ['KeyD', 'ArrowRight', GamepadStickDirections.LeftStickRight]
      },
      use: {
        keys: ['Space', GamepadButtons.ButtonB],
        overrides: ['place']
      },
      place: {
        keys: ['KeyV', GamepadButtons.ButtonA],
        overrides: ['use']
      },
      fire: {
        keys: ['KeyC', GamepadButtons.ButtonX],
        singlePress: true
      }
    });

    const screensStore = <ScreensStore>this.stores.screens;
    screensStore.subscribe((state: ScreensStoreContent) => {
      if (!this.inputMap) {
        return;
      }

      if (state.active === Screens.Game) {
        this.inputMap.enable();
      } else {
        this.inputMap.disable();
      }
    });
  }

  protected onTick(_ctx: PropsContext<CharacterContainerProps>, timeDifference: number): void {
    const characterStore = <CharacterStore>this.stores.character;
    const characterStoreContent = characterStore.content;
    const movablesStore = <MovablesStore>this.stores.movables;
    const effectsStore = <EffectsStore>this.stores.effects;
    const gridStore = <GridStore>this.stores.grid;
    const statsStore = <StatsStore>this.stores.score;

    // Read inputs
    const inputs = this.inputMap!.pressed;

    if (!effectsStore.content.gameOver.active) {
      let moveX = 0;
      let moveY = 0;
      if (inputs.up) {
        moveY -= inputs.up * values.character.movementSpeed * (timeDifference / 1000);
      }
      if (inputs.down) {
        moveY += inputs.down * values.character.movementSpeed * (timeDifference / 1000);
      }
      if (inputs.right) {
        moveX += inputs.right * values.character.movementSpeed * (timeDifference / 1000);
      }
      if (inputs.left) {
        moveX -= inputs.left * values.character.movementSpeed * (timeDifference / 1000);
      }

      characterStore.move(moveX, moveY);

      if (inputs.use) {
        const field = gridStore.content[characterStoreContent.fieldY][characterStoreContent.fieldX];
        let isGrownPlant = false;
        if (field.type === TileContents.Plant && field.data.age as number >= values.plant.age.fullyGrown) {
          isGrownPlant = true;
        }

        gridStore.removeContent(characterStoreContent.fieldX, characterStoreContent.fieldY, removedContent => {
          // Determine what was removed and display the corresponding item and add points
          let addedScore = 0;
          switch (removedContent) {
            case TileContents.Mole:
              addedScore = values.scores.mole;
              characterStore.heldItem = HoldableItems.Hammer;
              break;

            case TileContents.Plant:
              if (isGrownPlant) {
                addedScore = values.scores.plant;
              }
              characterStore.heldItem = HoldableItems.Shovel;
              break;
            case TileContents.Weed:
              addedScore = values.scores.weed;
              characterStore.heldItem = HoldableItems.Shovel;
              break;
            case TileContents.Molehill:
              characterStore.heldItem = HoldableItems.Shovel;
              break;
          }

          if (addedScore > 0) {
            // Add score
            statsStore.addScore(addedScore);

            // Trigger scoring animation
            effectsStore.showScoreEffect(
              characterStoreContent.fieldX * 128 + 288 + 32,
              characterStoreContent.fieldY * 128 + 176 + 64,
              addedScore
            );
          }
        });
      }

      if (inputs.place) {
        characterStore.heldItem = HoldableItems.None;
        gridStore.placePlant(characterStoreContent.fieldX, characterStoreContent.fieldY);
      }

      if (inputs.fire && this.nextShotAvailable) {
        characterStore.fireGun();

        // Vibrate gamepad
        // Test if the gamepad API is supported by the browser
        if ('getGamepads' in navigator) {
          const allGamepads = navigator.getGamepads();
          for (const gamepad of allGamepads) {
            if (!gamepad) {
              continue;
            }

            // Test if and which API for haptic feedback is available
            if ('hapticActuators' in gamepad) {
              for (const actuator of gamepad.hapticActuators) {
                // @ts-ignore
                actuator.pulse(0.7, 100);
              }
            } else if ('vibrationActuator' in gamepad) {
              (<Gamepad>gamepad).vibrationActuator?.playEffect('dual-rumble', {
                startDelay: 0,
                duration: 100,
                weakMagnitude: 0.7,
                strongMagnitude: 0.7
              });
            }
          }
        }

        // Play sound effect
        const settingsStore = <SettingsStore>this.stores.settings;
        if (settingsStore.content.volume > 0) {
          const audio = new Audio(shotgunSound);
          audio.volume = settingsStore.content.volume * 0.4;
          audio.play();
        }

        // Store updated timestamp
        this.nextShotAvailableAt = window.performance.now() + 1200;

        // Detect collision with bullets
        movablesStore.detectHit(characterStore.content.bullets, (x: number, y: number) => {
          // Add score & show effects
          statsStore.addScore(values.scores.rabbit);
          effectsStore.showSmoke(x + 96, y + 256);
          effectsStore.showScoreEffect(x + 128, y + 320, values.scores.rabbit);
        });
      }
    }
  }

  protected template: Template = [
    {
      component: new Character(),
      position: (): Coordinates =>
        new Coordinates(this.stores.character.content.posX - 32, this.stores.character.content.posY - 128),
      props: (): CharacterProps => {
        const characterStore = <CharacterStore>this.stores.character;
        const characterStoreContent = characterStore.content;

        return {
          direction: characterStoreContent.direction,
          heldItem: characterStoreContent.heldItem,
          hammerPosition: characterStore.hammerPosition
        };
      }
    }
  ];
}

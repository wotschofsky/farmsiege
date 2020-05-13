import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import InputMap, { GamepadButtons, GamepadStickDirections } from '../../lib/InputMap';
import PropsContext from '../../lib/PropsContext';

import CharacterStore, { HoldableItems } from '../store/CharacterStore';
import EffectsStore from '../store/EffectsStore';
import GridStore from '../store/GridStore';
import ScreensStore, { ScreensStoreContent, Screens } from '../store/ScreensStore';
import SettingsStore from '../store/SettingsStore';
import StatsStore from '../store/StatsStore';

import Character, { CharacterProps } from './character/Character';

import shotgunSound from '../assets/sounds/shotgun.mp3';

import TileContents from '../TileContents';
import values from '../values.json';

export type CharacterContainerProps = {};

export default class CharacterContainer extends Component<CharacterContainerProps> {
  private inputMap: InputMap;
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
      if (state.active === Screens.Game) {
        this.inputMap.enable();
      } else {
        this.inputMap.disable();
      }
    });
  }

  protected onTick(ctx: PropsContext<CharacterContainerProps>, timeDifference: number): void {
    const characterStore = <CharacterStore>this.stores.character;
    const characterStoreContent = characterStore.content;
    const effectsStore = <EffectsStore>this.stores.effects;
    const gridStore = <GridStore>this.stores.grid;
    const statsStore = <StatsStore>this.stores.score;

    // Eingaben auslesen
    const inputs = this.inputMap.pressed;

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
        if (field.type === TileContents.Plant && field.data.age >= 15000) {
          isGrownPlant = true;
        }

        gridStore.removeContent(characterStoreContent.fieldX, characterStoreContent.fieldY, removedContent => {
          // Ermitteln, was Entfernt wurde und den entsprechenden Gegenstand anzeigen und Punkte hinzufügen
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
            const effectsStore = <EffectsStore>this.stores.effects;

            // Punkte hinzufügen
            statsStore.addScore(addedScore);

            // Punkteanimation anzeigen
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

        // Controller vibrieren lassen
        // Testen ob die Gamepad API vom Browser unterstützt wird
        if ('getGamepads' in navigator) {
          const allGamepads = navigator.getGamepads();
          for (const gamepad of allGamepads) {
            if (!gamepad) {
              continue;
            }

            // Testen ob und welche API für haptisches Feedback verfügbar ist
            if ('hapticActuators' in gamepad) {
              for (const actuator of gamepad.hapticActuators) {
                actuator.pulse(0.7, 100);
              }
            } else if ('vibrationActuator' in gamepad) {
              (<Gamepad>gamepad).vibrationActuator.playEffect('dual-rumble', {
                startDelay: 0,
                duration: 100,
                weakMagnitude: 0.7,
                strongMagnitude: 0.7
              });
            }
          }
        }

        // Soundeffekt abspielen
        const settingsStore = <SettingsStore>this.stores.settings;
        if (settingsStore.content.volume > 0) {
          const audio = new Audio(shotgunSound);
          audio.volume = settingsStore.content.volume * 0.4;
          audio.play();
        }

        // Neuen Timestamp speichern
        this.nextShotAvailableAt = window.performance.now() + 1200;
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

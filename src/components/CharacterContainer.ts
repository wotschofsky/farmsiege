import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import InputMap, { GamepadButtons, GamepadStickDirections } from '../../lib/InputMap';

import Character, { CharacterProps } from './character/Character';
import CharacterStore from '../store/CharacterStore';
import GridStore from '../store/GridStore';
import shotgunSound from '../assets/sounds/shotgun.mp3';
import StatsStore from '../store/StatsStore';
import TileContents from '../TileContents';
import SettingsStore from '../store/SettingsStore';
import EffectsStore from '../store/EffectsStore';

import values from '../values.json';

export type CharacterContainerProps = {};

export default class CharacterContainer extends Component<CharacterContainerProps> {
  private inputMap: InputMap;
  private positionX = (1024 - 128) / 2;
  private positionY = 1024 / 2;

  private hasMoved = false;
  private nextShotAvailable = 0;

  protected onInit(): void {
    this.inputMap = new InputMap({
      up: ['KeyW', 'ArrowUp', GamepadStickDirections.LeftStickUp],
      left: ['KeyA', 'ArrowLeft', GamepadStickDirections.LeftStickLeft],
      down: ['KeyS', 'ArrowDown', GamepadStickDirections.LeftStickDown],
      right: ['KeyD', 'ArrowRight', GamepadStickDirections.LeftStickRight],
      '!use': ['Space', GamepadButtons.ButtonB],
      '!place': ['KeyV', GamepadButtons.ButtonA],
      '!fire': ['KeyC', GamepadButtons.ButtonX]
    });
  }

  protected onTick(_, timeDifference: number): void {
    const characterStore = <CharacterStore>this.stores.character;
    const effectsStore = <EffectsStore>this.stores.effects;
    const gridStore = <GridStore>this.stores.grid;
    const statsStore = <StatsStore>this.stores.score;

    const inputs = this.inputMap.pressed;

    if (!effectsStore.directContent.gameOver.active) {
      let moveX = 0;
      let moveY = 0;
      if (inputs.up) moveY -= 1000 * (timeDifference / 1000);
      if (inputs.down) moveY += 1000 * (timeDifference / 1000);
      if (inputs.right) moveX += 1000 * (timeDifference / 1000);
      if (inputs.left) moveX -= 1000 * (timeDifference / 1000);

      this.hasMoved = moveX !== 0;

      characterStore.move(moveX, moveY);

      if (inputs.use) {
        const field = gridStore.content[characterStore.content.fieldX][characterStore.content.fieldY];
        let isGrownPlant = false;
        if (field.type === TileContents.Plant && field.data.age >= 15000) {
          isGrownPlant = true;
        }

        gridStore.removeContent(characterStore.content.fieldX, characterStore.content.fieldY, removedContent => {
          let addedScore = 0;
          switch (removedContent) {
            case TileContents.Mole:
              addedScore = values.scores.mole;
              break;
            case TileContents.Plant:
              if (isGrownPlant) {
                addedScore = values.scores.plant;
              }
              break;
            case TileContents.Weed:
              addedScore = values.scores.weed;
              break;
          }

          if (addedScore > 0) {
            const effectsStore = <EffectsStore>this.stores.effects;

            statsStore.addScore(addedScore);
            effectsStore.showScoreEffect(
              characterStore.content.fieldX * 128 + 288 + 32,
              characterStore.content.fieldY * 128 + 176 + 64,
              addedScore
            );
          }
        });
      }

      if (inputs.place) {
        gridStore.placePlant(characterStore.content.fieldX, characterStore.content.fieldY);
      }

      if (inputs.fire) {
        if (this.nextShotAvailable <= Date.now()) {
          const characterStore = <CharacterStore>this.stores.character;
          const settingsStore = <SettingsStore>this.stores.settings;
          characterStore.fireGun();

          for (const gamepad of navigator.getGamepads()) {
            if (gamepad) {
              let feedbackGiven = false;

              if ('hapticActuators' in gamepad) {
                for (const actuator of gamepad.hapticActuators) {
                  actuator.pulse(0.7, 100);
                  feedbackGiven = true;
                }
              }

              if (!feedbackGiven && 'vibrationActuator' in gamepad) {
                (<Gamepad>gamepad).vibrationActuator.playEffect('dual-rumble', {
                  startDelay: 0,
                  duration: 100,
                  weakMagnitude: 0.7,
                  strongMagnitude: 0.7
                });
              }
            }
          }

          if (settingsStore.content.music) {
            new Audio(shotgunSound).play();
          }

          this.nextShotAvailable = Date.now() + 1200;
        }
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

        return {
          direction: characterStore.content.direction
        };
      }
    }
  ];
}

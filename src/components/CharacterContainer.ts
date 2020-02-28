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
    const characterStore = this.stores.character as CharacterStore;
    const gridStore = this.stores.grid as GridStore;
    const statsStore = this.stores.score as StatsStore;

    const inputs = this.inputMap.pressed;

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
      if (field.type === TileContents.Plant && field.data.age >= 15000) {
        statsStore.addScore(10);
      }

      gridStore.removeContent(characterStore.content.fieldX, characterStore.content.fieldY);
    }

    if (inputs.place) {
      gridStore.placePlant(characterStore.content.fieldX, characterStore.content.fieldY);
    }

    if (inputs.fire) {
      if (this.nextShotAvailable <= Date.now()) {
        const characterStore = this.stores.character as CharacterStore;
        const settingsStore = this.stores.settings as SettingsStore;
        characterStore.fireGun();

        for (const gamepad of navigator.getGamepads()) {
          if (gamepad) {
            if ('hapticActuators' in gamepad) {
              gamepad.hapticActuators[0].pulse(0.7, 100);
            } else if ('vibrationActuator' in gamepad) {
              gamepad.vibrationActuator.playEffect('dual-rumble', {
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

  protected template: Template = [
    {
      component: new Character(),
      position: (): Coordinates =>
        new Coordinates(this.stores.character.content.posX - 32, this.stores.character.content.posY - 128),
      props: (): CharacterProps => {
        const characterStore = this.stores.character as CharacterStore;

        return {
          direction: characterStore.content.direction
        };
      }
    }
  ];
}

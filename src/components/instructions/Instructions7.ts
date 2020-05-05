import { Directions } from '../../../lib/Enums';
import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import PropsContext from '../../../lib/PropsContext';
import Rectangle, { RectangleProps } from '../../../lib/components/native/Rectangle';
import Repeating, { RepeatingProps } from '../../../lib/components/logical/Repeating';
import Text, { TextProps } from '../../../lib/components/native/Text';

import { HoldableItems } from '../../store/CharacterStore';
import BulletData from '../../store/models/BulletData';

import Character, { CharacterProps } from '../character/Character';
import ControllerXButton, { ControllerXButtonProps } from '../inputButtons/ControllerXButton';
import KeyboardCButton, { KeyboardCButtonProps } from '../inputButtons/KeyboardCButton';
import Rabbit, { RabbitProps } from '../animals/Rabbit';
import ScoreEffect, { ScoreEffectProps } from '../ScoreEffect';

import values from '../../values.json';

export type Instructions7Props = {};

export default class Instructions7 extends Component<Instructions7Props> {
  private timer = 0;
  private bullets: BulletData[] = [];
  private nextGunFire = 1500;

  protected onTick(ctx: PropsContext<Instructions7>, timeDifference: number): void {
    this.timer += timeDifference;

    this.bullets = this.bullets.filter(bullet => bullet.age < 65);

    for (const bullet of this.bullets) {
      bullet.update(timeDifference);
    }

    if (this.timer >= this.nextGunFire) {
      this.fireGun();
      this.nextGunFire += 2600;
    }
  }

  private fireGun(): void {
    for (let i = 0; i < 10; i++) {
      const direction = Math.PI * (-0.5 * 0.2) + Math.random() * Math.PI * 0.2;

      const bullet = new BulletData(220, 140, direction);

      this.bullets.push(bullet);
    }
  }

  private get showRabbit(): boolean {
    const time = this.timer % 2600;
    return time >= 0 && time < 1550;
  }

  private get buttonPressed(): boolean {
    const time = this.timer % 2600;
    return time >= 1500 && time < 1750;
  }

  private get showScore(): boolean {
    const time = this.timer % 2600;
    return time >= 1550;
  }

  protected template: Template = [
    // Anweisung
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): TextProps => ({
        text: 'Shoot the rabbits!',
        color: '#fff',
        font: 'Heartbit',
        size: 40
      })
    },

    // Animation
    {
      component: new Rabbit(),
      position: (): Coordinates => new Coordinates(180, 15),
      props: (): RabbitProps => ({
        direction: Directions.Left,
        moving: false
      }),
      show: (): boolean => this.showRabbit
    },
    {
      component: new ScoreEffect(),
      position: (): Coordinates => new Coordinates(350, 150),
      props: (): ScoreEffectProps => ({
        value: values.scores.rabbit
      }),
      show: (): boolean => this.showScore
    },
    {
      component: new Character(),
      position: (): Coordinates => new Coordinates(-16, 0),
      props: (): CharacterProps => ({
        direction: Directions.Right,
        heldItem: HoldableItems.Gun
      })
    },
    {
      component: new Repeating(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): RepeatingProps => {
        return {
          list: this.bullets,
          component: (): Rectangle => new Rectangle(),
          position: (data: BulletData): Coordinates => new Coordinates(data.x, data.y),
          props: (): RectangleProps => ({
            color: '#000',
            width: 12,
            height: 12
          })
        };
      }
    },

    // Buttons
    {
      component: new KeyboardCButton(),
      position: (): Coordinates => new Coordinates(425, 75),
      props: (): KeyboardCButtonProps => ({
        pressed: this.buttonPressed
      })
    },
    {
      component: new ControllerXButton(),
      position: (): Coordinates => new Coordinates(425, 150),
      props: (): ControllerXButtonProps => ({
        pressed: this.buttonPressed
      })
    }
  ];
}

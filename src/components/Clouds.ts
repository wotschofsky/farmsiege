import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import PropsContext from '../../lib/PropsContext';
import Sprite, { SpriteProps } from '../../lib/components/native/Sprite';

import cloud1 from '../assets/clouds/cloud_1.png';
import cloud2 from '../assets/clouds/cloud_2.png';
import cloud3 from '../assets/clouds/cloud_3.png';

export type CloudProps = {};

export default class Clouds extends Component<CloudProps> {
  private pos1 = 100;
  private pos2 = 1000;
  private pos3 = 400;

  protected onTick(ctx: PropsContext<CloudProps>, timeDifference: number): void {
    // Wolken nach rechts verschieben und bei Bedarf nach links zurücksetzen
    this.pos1 = this.pos1 > 500 + 1600 ? -610 / 1.5 : this.pos1 + (timeDifference / 1000) * 50;
    this.pos2 = this.pos2 > 500 + 1600 ? -580 / 1.5 : this.pos2 + (timeDifference / 1000) * 50;
    this.pos3 = this.pos3 > 500 + 1600 ? -435 : this.pos3 + (timeDifference / 1000) * 30;
  }

  protected template: Template = [
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(this.pos3, 10),
      props: (): SpriteProps => ({
        source: cloud3,
        width: 435,
        height: 140
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(this.pos1, 40),
      props: (): SpriteProps => ({
        source: cloud1,
        width: 610 / 1.5,
        height: 300 / 1.5
      })
    },
    {
      component: new Sprite(),
      position: (): Coordinates => new Coordinates(this.pos2, 30),
      props: (): SpriteProps => ({
        source: cloud2,
        width: 580 / 1.5,
        height: 290 / 1.5
      })
    }
  ];
}

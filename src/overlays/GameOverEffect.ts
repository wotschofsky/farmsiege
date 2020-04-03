import Component from '../../lib/Component';
import { Template } from '../../lib/Types';
import Arc, { ArcProps } from '../../lib/components/native/Arc';
import GridStore from '../store/GridStore';
import Coordinates from '../../lib/helpers/Coordinates';
import EffectsStore from '../store/EffectsStore';

export type GameOverEffectProps = {}

export default class GameOverEffect extends Component<GameOverEffectProps> {
  template: Template = [
    {
      component: new Arc(),
      position: (): Coordinates => {
        const gridStore = <GridStore>this.stores.grid;
        gridStore.lastRemovedPlant;
        return new Coordinates(
          gridStore.lastRemovedPlant.x * 128 + 64 + 288,
          gridStore.lastRemovedPlant.y * 128 + 64 + 176
        );
      },
      props: (): ArcProps => {
        const effectsStore = <EffectsStore>this.stores.effects;
        const effectData = effectsStore.directContent.gameOver;
        const distanceToCorner = Math.max(
          // Abstand nach links oben
          Math.sqrt(effectData.center.x ** 2 + effectData.center.y ** 2),
          // Abstand nach rechts oben
          Math.sqrt((1600 - effectData.center.x) ** 2 + effectData.center.y ** 2),
          // Abstand nach links unten
          Math.sqrt(effectData.center.x ** 2 + (1200 - effectData.center.y) ** 2),
          // Abstand nach rechts unten
          Math.sqrt((1600 - effectData.center.x) ** 2 + (1200 - effectData.center.y) ** 2)
        );

        return {
          radius: distanceToCorner,
          color: 'transparent',
          startingAngle: 0,
          endingAngle: Math.PI * 2,
          borderColor: '#000',
          borderWidth: distanceToCorner * 2 * effectsStore.endAnimationProgress
        };
      },
      show: (): boolean => {
        const effectsStore = <EffectsStore>this.stores.effects;
        return effectsStore.directContent.gameOver.active;
      }
    }
  ];
}

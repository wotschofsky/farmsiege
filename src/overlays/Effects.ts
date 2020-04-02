import Component from '../../lib/Component';
import { Template } from '../../lib/Types';
import Repeating, { RepeatingProps } from '../../lib/components/logical/Repeating';
import Coordinates from '../../lib/helpers/Coordinates';
import EffectsStore from '../store/EffectsStore';
import SmokeData from '../store/effects/SmokeData';
import ScoreEffectData from '../store/effects/ScoreEffectData';
import Smoke from '../components/Smoke';
import Text, { TextProps } from '../../lib/components/native/Text';

type EffectsProps = {};

export default class Effects extends Component<EffectsProps> {
  protected template: Template = [
    {
      component: new Repeating(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): RepeatingProps => {
        const effectsStore = this.stores.effects as EffectsStore;

        return {
          list: effectsStore.content.smoke,
          component: (): Smoke => new Smoke(),
          position: (data: SmokeData): Coordinates => data.position,
          props: (): {} => ({})
        };
      }
    },
    {
      component: new Repeating(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): RepeatingProps => {
        const effectsStore = this.stores.effects as EffectsStore;

        return {
          list: effectsStore.content.scores,
          component: (): Text => new Text(),
          position: (data: ScoreEffectData): Coordinates => {
            return new Coordinates(data.position.x, data.position.y - data.verticalOffset);
          },
          props: (data: ScoreEffectData): TextProps => ({
            text: `+${data.value}`,
            color: '#fff',
            size: 36
          })
        };
      }
    }
  ];
}

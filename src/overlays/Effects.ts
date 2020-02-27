import Component from '../../lib/Component';
import { Template } from '../../lib/Types';
import Repeating, { RepeatingProps } from '../../lib/components/logical/Repeating';
import Coordinates from '../../lib/helpers/Coordinates';
import EffectsStore from '../store/EffectsStore';
import Smoke from '../components/Smoke';
import SmokeData from '../store/effects/SmokeData';

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
    }
  ];
}

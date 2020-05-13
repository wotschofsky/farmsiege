import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';

import GridStore from '../store/GridStore';

import Bullets from '../overlays/Bullets';
import CharacterContainer from '../components/CharacterContainer';
import Grid, { GridProps } from '../components/grid/Grid';
import Rabbits from '../overlays/Rabbits';

export type GameScreenProps = {};

export default class GameScreen extends Component<GameScreenProps> {
  protected template: Template = [
    {
      component: new Grid(),
      position: (): Coordinates => new Coordinates(288, 176),
      props: (): GridProps => {
        const gridStore = <GridStore>this.stores.grid;

        return {
          grid: gridStore.content
        };
      }
    },
    {
      component: new Rabbits(),
      position: (): Coordinates => new Coordinates(0, 176)
    },
    {
      component: new CharacterContainer(),
      position: (): Coordinates => new Coordinates(288, 176)
    },
    {
      component: new Bullets(),
      position: (): Coordinates => new Coordinates(0, 0)
    }
  ];
}

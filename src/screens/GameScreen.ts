import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';

import CharacterStore from '../store/CharacterStore';
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
        const characterStore = <CharacterStore>this.stores.character;

        const characterStoreContent = characterStore.content;
        const playerPosition = new Coordinates(characterStoreContent.fieldX, characterStoreContent.fieldY);

        return {
          grid: gridStore.content,
          playerPosition
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

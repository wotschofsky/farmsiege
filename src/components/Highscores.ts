import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import Repeating, { RepeatingProps } from '../../lib/components/logical/Repeating';
import Text, { TextProps } from '../../lib/components/native/Text';

import HighscoreItem, { HighscoreItemProps } from './HighscoreItem';
import MiscStore from '../store/MiscStore';

export type ScoreData = {
  score: number;
  name: string;
};

type HighscoresProps = {};

export default class Highscores extends Component<HighscoresProps> {
  private get scores(): ScoreData[] {
    const miscStore = <MiscStore>this.stores.misc;
    return miscStore.content.highscores;
  }

  protected template: Template = [
    {
      component: new Repeating(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): RepeatingProps => ({
        list: this.scores,
        component: (): HighscoreItem => new HighscoreItem(),
        position: (data: ScoreData, index: number): Coordinates => new Coordinates(0, index * 36),
        props: (data: ScoreData, index: number): HighscoreItemProps => ({
          position: index + 1,
          name: data.name,
          score: data.score
        })
      })
    }
  ];
}

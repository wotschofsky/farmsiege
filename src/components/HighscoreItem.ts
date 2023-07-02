import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import PropsContext from '../../lib/PropsContext';
import Text, { TextProps } from '../../lib/components/native/Text';

export type HighscoreItemProps = {
  position: number | string;
  name: string;
  score: number | string;
};

export default class HighscoreItem extends Component<HighscoreItemProps> {
  protected template: Template = [
    // Position
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<HighscoreItemProps>): TextProps => {
        return {
          text: `#${ctx.props.position}`,
          color: '#fff',
          font: 'Heartbit',
          size: 40
        };
      }
    },

    // Username
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(64, 0),
      props: (ctx: PropsContext<HighscoreItemProps>): TextProps => {
        return {
          text: ctx.props.name,
          color: '#fff',
          font: 'Heartbit',
          size: 40
        };
      }
    },

    // Score
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(384, 0),
      props: (ctx: PropsContext<HighscoreItemProps>): TextProps => {
        return {
          text: ctx.props.score.toString(),
          color: '#fff',
          font: 'Heartbit',
          size: 40
        };
      }
    }
  ];
}

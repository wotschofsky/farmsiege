import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import PropsContext from '../../lib/PropsContext';
import Text, { TextProps } from '../../lib/components/native/Text';

export type ScoreEffectProps = {
  value: number | string;
};

export default class ScoreEffect extends Component<ScoreEffectProps> {
  protected template: Template = [
    {
      component: new Text(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<ScoreEffectProps>): TextProps => ({
        text: `+${ctx.props.value}`,
        color: '#fff',
        font: 'Heartbit',
        size: 48
      })
    }
  ];
}

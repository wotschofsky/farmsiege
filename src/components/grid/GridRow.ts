import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import GridTile, { GridTileProps } from './GridTile';
import PropsContext from '../../../lib/PropsContext';

export type GridRowProps = {
  index: number;
};

export default class GridRow extends Component<GridRowProps> {
  protected template: Template = [
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 0
      })
    },
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(128, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 1
      })
    },
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(128 * 2, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 2
      })
    },
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(128 * 3, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 3
      })
    },
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(128 * 4, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 4
      })
    },
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(128 * 5, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 5
      })
    },
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(128 * 6, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 6
      })
    },
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(128 * 7, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 7
      })
    }
  ];
}

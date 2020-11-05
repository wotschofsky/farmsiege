import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import GridRow, { GridRowProps } from './GridRow';
import PropsContext from '../../../lib/PropsContext';

import { GridData } from '../../store/GridStore';

export type GridProps = {
  grid: GridData;
  playerPosition: Coordinates;
};

export default class Grid extends Component<GridProps> {
  protected template: Template = [
    {
      component: new GridRow(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<GridProps>): GridRowProps => ({
        index: 0,
        rowData: ctx.props.grid[0],
        playerPosition: ctx.props.playerPosition
      })
    },
    {
      component: new GridRow(),
      position: (): Coordinates => new Coordinates(0, 128),
      props: (ctx: PropsContext<GridProps>): GridRowProps => ({
        index: 1,
        rowData: ctx.props.grid[1],
        playerPosition: ctx.props.playerPosition
      })
    },
    {
      component: new GridRow(),
      position: (): Coordinates => new Coordinates(0, 128 * 2),
      props: (ctx: PropsContext<GridProps>): GridRowProps => ({
        index: 2,
        rowData: ctx.props.grid[2],
        playerPosition: ctx.props.playerPosition
      })
    },
    {
      component: new GridRow(),
      position: (): Coordinates => new Coordinates(0, 128 * 3),
      props: (ctx: PropsContext<GridProps>): GridRowProps => ({
        index: 3,
        rowData: ctx.props.grid[3],
        playerPosition: ctx.props.playerPosition
      })
    },
    {
      component: new GridRow(),
      position: (): Coordinates => new Coordinates(0, 128 * 4),
      props: (ctx: PropsContext<GridProps>): GridRowProps => ({
        index: 4,
        rowData: ctx.props.grid[4],
        playerPosition: ctx.props.playerPosition
      })
    },
    {
      component: new GridRow(),
      position: (): Coordinates => new Coordinates(0, 128 * 5),
      props: (ctx: PropsContext<GridProps>): GridRowProps => ({
        index: 5,
        rowData: ctx.props.grid[5],
        playerPosition: ctx.props.playerPosition
      })
    },
    {
      component: new GridRow(),
      position: (): Coordinates => new Coordinates(0, 128 * 6),
      props: (ctx: PropsContext<GridProps>): GridRowProps => ({
        index: 6,
        rowData: ctx.props.grid[6],
        playerPosition: ctx.props.playerPosition
      })
    },
    {
      component: new GridRow(),
      position: (): Coordinates => new Coordinates(0, 128 * 7),
      props: (ctx: PropsContext<GridProps>): GridRowProps => ({
        index: 7,
        rowData: ctx.props.grid[7],
        playerPosition: ctx.props.playerPosition
      })
    }
  ];
}

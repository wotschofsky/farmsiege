import { Template } from '../../../lib/Types';
import Component from '../../../lib/Component';
import Coordinates from '../../../lib/helpers/Coordinates';
import GridTile, { GridTileProps } from './GridTile';
import PropsContext from '../../../lib/PropsContext';
import { RowData } from '../../store/GridStore';

export type GridRowProps = {
  index: number;
  rowData: RowData;
};

export default class GridRow extends Component<GridRowProps> {
  protected template: Template = [
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 0,
        tileData: ctx.props.rowData[0]
      })
    },
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(128, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 1,
        tileData: ctx.props.rowData[1]
      })
    },
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(128 * 2, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 2,
        tileData: ctx.props.rowData[2]
      })
    },
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(128 * 3, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 3,
        tileData: ctx.props.rowData[3]
      })
    },
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(128 * 4, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 4,
        tileData: ctx.props.rowData[4]
      })
    },
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(128 * 5, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 5,
        tileData: ctx.props.rowData[5]
      })
    },
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(128 * 6, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 6,
        tileData: ctx.props.rowData[6]
      })
    },
    {
      component: new GridTile(),
      position: (): Coordinates => new Coordinates(128 * 7, 0),
      props: (ctx: PropsContext<GridRowProps>): GridTileProps => ({
        row: ctx.props.index,
        column: 7,
        tileData: ctx.props.rowData[7]
      })
    }
  ];
}

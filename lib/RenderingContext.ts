import Dimensions from './helpers/Dimensions';

export default class RenderingContext {
  private _grid: Dimensions;
  private _parentX: number;
  private _parentY: number;
  private _canvas: HTMLCanvasElement;
  private _renderContext: CanvasRenderingContext2D;
  private _scaleFactor: number;
  private _timeDifference: number;
  private _frameStart: number;

  public get grid(): Dimensions {
    return this._grid;
  }

  public get parentX(): number {
    return this._parentX;
  }

  public get parentY(): number {
    return this._parentY;
  }

  public get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  public get renderContext(): CanvasRenderingContext2D {
    return this._renderContext;
  }

  public get scaleFactor(): number {
    return this._scaleFactor;
  }

  public get timeDifference(): number {
    return this._timeDifference;
  }

  public get frameStart(): number {
    return this._frameStart;
  }

  public constructor(
    grid: Dimensions,
    parentX: number,
    parentY: number,
    canvas: HTMLCanvasElement,
    renderContext: CanvasRenderingContext2D,
    scaleFactor: number,
    timeDifference: number,
    frameStart: number
  ) {
    this._grid = grid;
    this._parentX = parentX;
    this._parentY = parentY;
    this._canvas = canvas;
    this._renderContext = renderContext;
    this._scaleFactor = scaleFactor;
    this._timeDifference = timeDifference;
    this._frameStart = frameStart;
  }
}

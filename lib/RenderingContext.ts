import Dimensions from './helpers/Dimensions';

export default class RenderingContext {
  private _frame: Dimensions;
  private _parentX: number;
  private _parentY: number;
  private _canvas: HTMLCanvasElement;
  private _renderContext: CanvasRenderingContext2D;
  private _scaleFactor: number;
  private _timeDifference: number;
  private _frameStart: number;

  public get frame(): Dimensions {
    return this._frame;
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
    frame: Dimensions,
    parentX: number,
    parentY: number,
    canvas: HTMLCanvasElement,
    renderContext: CanvasRenderingContext2D,
    scaleFactor: number,
    timeDifference: number,
    frameStart: number
  ) {
    this._frame = frame;
    this._parentX = parentX;
    this._parentY = parentY;
    this._canvas = canvas;
    this._renderContext = renderContext;
    this._scaleFactor = scaleFactor;
    this._timeDifference = timeDifference;
    this._frameStart = frameStart;
  }
}

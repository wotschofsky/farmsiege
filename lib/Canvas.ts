import { EventTypes } from './Enums';
import Component from './Component';
import Coordinates from './helpers/Coordinates';
import Dimensions from './helpers/Dimensions';
import FPSDisplay from './FPSDisplay';
import RenderingContext from './RenderingContext';

type CanvasConfig = {
  el: HTMLCanvasElement;
  grid: Dimensions;
  root: Component<any>;
  showFPS: boolean;
};

class Canvas {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private root: Component<any>;
  private scaleFactor: number;
  private grid: Dimensions;
  private showFPS?: boolean;

  private fpsDisplay: FPSDisplay;

  private lastFrameOn: number;
  private frameStart: number;

  public constructor(config: CanvasConfig) {
    this.scaleFactor = 1;

    this.canvas = config.el;
    this.root = config.root;
    this.grid = config.grid;
    this.showFPS = config.showFPS || false;

    // Initialize FPSDisplay
    this.fpsDisplay = new FPSDisplay();

    this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');

    // Adjust to screen resolution
    this.adjustToScreen();

    // Adjust to screen resolution when the window size changes
    window.addEventListener('resize', this.adjustToScreen.bind(this));

    // Create event listeners and propagate events to the root component
    this.canvas.addEventListener('click', event => {
      this.root.propagateEvent(EventTypes.Click, event);
    });

    window.addEventListener('keypress', event => {
      this.root.propagateEvent(EventTypes.Keypress, event);
    });

    window.addEventListener('keydown', event => {
      this.root.propagateEvent(EventTypes.Keydown, event);
    });

    window.addEventListener('keyup', event => {
      this.root.propagateEvent(EventTypes.Keyup, event);
    });

    // Start the rendering process
    this.lastFrameOn = window.performance.now();
    this.frameStart = window.performance.now();
    this.render();
  }

  private adjustToScreen(): void {
    // Calculate the dimensions of the canvas element in the browser
    const rect = this.canvas.getBoundingClientRect();

    // Calculate the aspect ratio
    const aspectRatio = this.grid.width / this.grid.height;

    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = this.canvas.width * (1 / aspectRatio);

    // Calculate the scaling factor
    this.scaleFactor = (rect.width / this.grid.width) * window.devicePixelRatio;
  }

  private render(): void {
    this.frameStart = window.performance.now();
    const timeDifference = this.frameStart - this.lastFrameOn;
    this.lastFrameOn = this.frameStart;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.root.render(
      new RenderingContext(
        this.grid,
        0,
        0,
        this.canvas,
        this.context,
        this.scaleFactor,
        timeDifference,
        this.frameStart
      ),
      new Coordinates(0, 0),
      {}
    );

    // Render FPSDisplay if enabled
    if (this.showFPS) {
      this.fpsDisplay.render(this.canvas, this.context, timeDifference, this.scaleFactor);
    }

    // Fallback if window.requestAnimationFrame is not available
    const requestAnimationFrame =
      window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;

    // Request the next render cycle of the browser
    requestAnimationFrame(this.render.bind(this));
  }
}

export default Canvas;

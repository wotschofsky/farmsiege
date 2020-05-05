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

    // FPSDisplay initialisieren
    this.fpsDisplay = new FPSDisplay();

    this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d');

    // Auflösung anpassen
    this.adjustToScreen();

    // Auflösung anpassen, wenn sich die Fenstergröße ändert
    window.addEventListener('resize', this.adjustToScreen.bind(this));

    // EventListener erstellen und Events an Root-Component weiterleiten
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

    // Renderprozess starten
    this.lastFrameOn = Date.now();
    this.frameStart = Date.now();
    this.render();
  }

  private adjustToScreen(): void {
    // Maße des Canvas Elements im Browser errechnen
    const rect = this.canvas.getBoundingClientRect();

    // Seitenverhältnis errechnen
    const aspectRatio = this.grid.width / this.grid.height;

    this.canvas.width = rect.width * window.devicePixelRatio;
    this.canvas.height = this.canvas.width * (1 / aspectRatio);

    // Skalierungsfaktor berechnen
    this.scaleFactor = (rect.width / this.grid.width) * window.devicePixelRatio;
  }

  private render(): void {
    this.frameStart = Date.now();
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

    // Wenn aktiviert, FPSDisplay rendern
    if (this.showFPS) {
      this.fpsDisplay.render(this.canvas, this.context, timeDifference, this.scaleFactor);
    }

    // Fallback, wenn window.requestAnimationFrame nicht verfügbar ist
    const requestAnimationFrame =
      window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;

    // Beim nächtsten Renderzyklus des Browsers Spiel neu rendern
    requestAnimationFrame(this.render.bind(this));
  }
}

export default Canvas;

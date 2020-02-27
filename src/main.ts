// import 'core-js/stable'

import Canvas from '../lib/Canvas';
import Game from './Game';
import Dimensions from '../lib/helpers/Dimensions';

class Main {
  private canvas: Canvas;

  public constructor() {
    // Spiel initialisieren
    this.canvas = new Canvas({
      el: document.getElementById('canvas') as HTMLCanvasElement,
      aspectRatio: 4 / 3,
      width: 600,
      grid: new Dimensions(1600, 1200),
      // Eigene Root Rootkomponente
      root: new Game(),
      showFPS: true
    });
  }
}

new Main();

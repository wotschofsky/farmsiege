import 'core-js/features/array/find';
import 'core-js/features/array/includes';
import 'core-js/features/symbol';

import Canvas from '../lib/Canvas';
import Game from './Game';
import Dimensions from '../lib/helpers/Dimensions';

class Main {
  public constructor() {
    // Spiel initialisieren
    new Canvas({
      el: <HTMLCanvasElement>document.getElementById('canvas'),
      grid: new Dimensions(1600, 1200),
      // Eigene Root-Component
      root: new Game(),
      showFPS: true
    });
  }
}

new Main();

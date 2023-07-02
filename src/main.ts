import Canvas from '../lib/Canvas';
import Game from './Game';
import Dimensions from '../lib/helpers/Dimensions';

class Main {
  public constructor() {
    // Initialize the game
    new Canvas({
      el: <HTMLCanvasElement>document.getElementById('canvas'),
      grid: new Dimensions(1600, 1200),
      // Use the custom root component
      root: new Game(),
      showFPS: true
    });
  }
}

new Main();

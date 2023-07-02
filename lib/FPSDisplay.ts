export default class FPSDisplay {
  private history: number[];
  private shownValue: number;
  private lastUpdate: number;

  public constructor() {
    this.history = [];
    this.shownValue = 0;
    this.lastUpdate = window.performance.now();
  }

  public render(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    timeDifference: number,
    scaleFactor: number
  ): void {
    const fps = Math.round(1000 / timeDifference);
    this.history.push(fps);
    if (window.performance.now() - this.lastUpdate >= 1000) {
      // Calculate average FPS value for the past second
      this.shownValue = Math.round(this.history.reduce((a, b) => a + b, 0) / this.history.length);

      // Replace initial value if it is Infinity
      if (this.shownValue === Infinity) {
        this.shownValue = 0;
      }

      // Reset the history and update time
      this.history = [];
      this.lastUpdate = window.performance.now();
    }

    // Save the current configuration
    context.save();

    // Render the FPS display
    context.font = `${scaleFactor * 16}px Arial`;
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(canvas.width - scaleFactor * 40, scaleFactor * 5, scaleFactor * 35, scaleFactor * 20);
    context.fillStyle = 'white';
    context.textAlign = 'right';
    context.textBaseline = 'top';

    context.fillText(this.shownValue.toString(), canvas.width - scaleFactor * 8, scaleFactor * 8);

    // Restore the configuration
    context.restore();
  }
}

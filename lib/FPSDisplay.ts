// Klasse um eine FPS-Anzeige im rechten oberen Eck zu rendern

export default class FPSDisplay {
  private history: number[];
  private shownValue: number;
  private lastUpdate: number;

  public constructor() {
    this.history = [];
    this.shownValue = 0;
    this.lastUpdate = Date.now();
  }

  public render(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    timeDifference: number,
    scaleFactor: number
  ): void {
    const fps = Math.round(1000 / timeDifference);
    this.history.push(fps);
    if (Date.now() - this.lastUpdate >= 1000) {
      // Durchschnitt der FPS Werte der letzten Sekunde berechnen
      this.shownValue = Math.round(this.history.reduce((a, b) => a + b, 0) / this.history.length);

      // Anfangswert ersetzen
      if (this.shownValue === Infinity) {
        this.shownValue = 0;
      }

      // Verlauf zurücksetzen
      this.history = [];
      this.lastUpdate = Date.now();
    }

    // Konfiguration speichern
    context.save();

    // FPS Anzeige rendern
    context.font = `${scaleFactor * 16}px Arial`;
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(canvas.width - scaleFactor * 40, scaleFactor * 5, scaleFactor * 35, scaleFactor * 20);
    context.fillStyle = 'white';
    context.textAlign = 'right';
    context.textBaseline = 'top';

    context.fillText(this.shownValue.toString(), canvas.width - scaleFactor * 8, scaleFactor * 8);

    // Konfiguration wiederherstellen
    context.restore();
  }
}

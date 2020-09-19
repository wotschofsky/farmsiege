import cloneDeep from 'clone-deep';
import Coordinates from '../../lib/helpers/Coordinates';
import Store from '../../lib/store/Store';
import Timer from 'better-timer';

import GridUtils from '../utils/Grid';
import Random from '../utils/Random';

import TileContents from '../TileContents';
import values from '../values.json';

export type TileData = {
  type: TileContents;
  data: Record<string, string | number>;
};

export type RowData = [TileData, TileData, TileData, TileData, TileData, TileData, TileData, TileData];

export type GridData = [RowData, RowData, RowData, RowData, RowData, RowData, RowData, RowData];

export type GridStoreContent = GridData;

export default class GridStore extends Store<GridStoreContent> {
  private timers: Timer[];
  private _speedMultiplier: number;
  private _lastRemovedPlant: Coordinates;

  public constructor() {
    const initialGrid = GridUtils.generateInitialGrid();
    super(initialGrid);

    this.timers = [];
    this._speedMultiplier = 1;
  }

  public reset(): void {
    this.update(GridUtils.generateInitialGrid);
  }

  public set speedMultiplier(value: number) {
    if (value < 1) {
      return;
    }

    this._speedMultiplier = value;
  }

  public start(): void {
    this.growPlants();

    {
      const duration = Random.between(values.mole.grace.min, values.mole.grace.max);
      const timer = new Timer(duration, this.updateMole.bind(this));
      this.timers.push(timer);
    }

    {
      const duration = Random.between(values.weed.grace.min, values.weed.grace.max);
      const timer = new Timer(duration, this.updateWeed.bind(this));
      this.timers.push(timer);
    }

    {
      const duration = Random.between(values.lightning.grace.min, values.lightning.grace.max);
      const timer = new Timer(duration, this.updateLightning.bind(this));
      this.timers.push(timer);
    }
  }

  public stop(): void {
    // Timer löschen, um zu verhindern, dass diese Code ausführen, nachdem das Spiel vorbei ist
    for (const timer of this.timers) {
      timer.cancel();
    }
    this.timers = [];
  }

  public removeContent(x: number, y: number, callback?: (removedContent: TileContents) => void): void {
    if (!GridUtils.isValidField(x, y) || this.content[y][x].type === TileContents.Lightning) {
      return;
    }

    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        // Feldinhaltstyp kopieren
        const tileContent = clonedState[y][x].type;

        // Feldinhalt leeren
        clonedState[y][x].type = TileContents.Empty;

        // Wenn es eine Pflanze war, Koordinaten für die Game Over Animation speichern
        if (tileContent === TileContents.Plant) {
          this._lastRemovedPlant = new Coordinates(x, y);
        }

        // Callback ausführen
        if (tileContent !== TileContents.Empty && callback) {
          callback(tileContent);
        }

        return clonedState;
      }
    );
  }

  public placePlant(x: number, y: number): void {
    if (!GridUtils.isValidField(x, y) || this.content[y][x].type !== TileContents.Empty) {
      return;
    }

    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        clonedState[y][x].type = TileContents.Plant;
        clonedState[y][x].data = {
          age: 0
        };

        return clonedState;
      }
    );
  }

  private growPlants(): void {
    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        for (const row of clonedState) {
          for (const tile of row) {
            if (tile.type === TileContents.Plant) {
              (<number>tile.data.age) += 100;
            }
          }
        }

        return clonedState;
      }
    );

    // Timer für nächsten Pflanzenzyklus starten
    const timer = new Timer(100, this.growPlants.bind(this));
    this.timers.push(timer);
  }

  private updateMole(): void {
    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        // Überprüfen, ob bereits ein Maulwurf im Spiel ist
        let moleActive = false;
        let molePosition = new Coordinates(0, 0);

        rowsLoop: for (let rowIndex = 0; rowIndex < clonedState.length; rowIndex++) {
          for (let columnIndex = 0; columnIndex < clonedState[rowIndex].length; columnIndex++) {
            // Referenz zu Feld speichern
            const tile = clonedState[rowIndex][columnIndex];

            // Überprüfen ob auf dem Feld ein Maulwurf ist
            if (tile.type === TileContents.Mole) {
              moleActive = true;
              molePosition = new Coordinates(columnIndex, rowIndex);

              // Weitere Durchgänge vermeiden
              break rowsLoop;
            }
          }
        }

        // Neue Position
        const row = Random.roundedBetween(0, 7);
        const col = Random.roundedBetween(0, 7);

        if (moleActive) {
          // Maulwurf verschieben und Hügel hinterlassen
          clonedState[row][col].type = TileContents.Mole;
          clonedState[molePosition.y][molePosition.x].type = TileContents.Molehill;
        } else {
          // Abbrechen, wenn Mindestwert für neuen Maulwurf nicht erreicht wird
          if (Math.random() > values.mole.newChance) {
            return clonedState;
          }

          // Koordinaten von evtl. Pflanze für GameOver Animation speichern
          if (clonedState[row][col].type === TileContents.Plant) {
            this._lastRemovedPlant = new Coordinates(col, row);
          }

          // Maulwurf erscheinen lassen
          clonedState[row][col].type = TileContents.Mole;
        }

        return clonedState;
      }
    );

    // Timer für nächsten Maulwurfszyklus starten
    const timer = new Timer(
      Random.between(values.mole.spawning.min, values.mole.spawning.max) / this._speedMultiplier,
      this.updateMole.bind(this)
    );
    this.timers.push(timer);
  }

  private updateWeed(): void {
    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState: GridStoreContent = cloneDeep(oldState);

        const foundWeed: Coordinates[] = [];
        clonedState.forEach((row, rowIndex) => {
          row.forEach((tile, columnIndex) => {
            // Überprüfen, ob auf dem Feld Unkraut ist
            if (tile.type === TileContents.Weed) {
              foundWeed.push(new Coordinates(columnIndex, rowIndex));
            }
          });
        });

        // Wenn Bedingung erfüllt wird an zufälliger Stelle neues Unkraut platzieren
        if (Math.random() < values.weed.newChance) {
          // Bis zu 10 mal versuchen eine leere Stelle zu finden und Unkraut zu platzieren
          for (let i = 0; i < 10; i++) {
            const row = Random.roundedBetween(0, 7);
            const col = Random.roundedBetween(0, 7);

            if (clonedState[row][col].type === TileContents.Empty) {
              clonedState[row][col].type = TileContents.Weed;
              break;
            }
          }
        }

        for (const coords of foundWeed) {
          // Wahrscheinlichkeit, dass sich Unkraut ausbreitet, nimmt mit der Anzahl ab
          if (Math.random() > 1 / Math.sqrt(foundWeed.length)) {
            break;
          }

          // Abbrechen, wenn Reihe nicht existiert
          const row = clonedState[coords.y + Random.roundedBetween(-1, 1)];
          if (!row) {
            break;
          }

          // Abbrechen, wenn Feld nicht existiert oder nicht leer ist
          const tile = row[coords.x + Random.roundedBetween(-1, 1)];
          if (!tile || tile.type !== TileContents.Empty) {
            break;
          }

          // Unkraut als Feldinhalt festlegen
          tile.type = TileContents.Weed;
        }

        return clonedState;
      }
    );

    // Timer für nächsten Unkrautszyklus starten
    const timer = new Timer(
      Random.between(values.weed.spawning.min, values.weed.spawning.max) / this._speedMultiplier,
      this.updateWeed.bind(this)
    );
    this.timers.push(timer);
  }

  private updateLightning(): void {
    const lightningRow = Random.roundedBetween(0, 7);
    const lightningCol = Random.roundedBetween(0, 7);

    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        let plantDestroyed = false;
        for (let rowIndex = -1; rowIndex <= 1; rowIndex++) {
          if (!GridUtils.rowExists(lightningRow + rowIndex)) {
            continue;
          }

          for (let colIndex = -1; colIndex <= 1; colIndex++) {
            if (!GridUtils.colExists(lightningCol + colIndex)) {
              continue;
            }

            // Referenz zu Feld speichern
            const tile = clonedState[lightningRow + rowIndex][lightningCol + colIndex];

            if (tile.type === TileContents.Plant) {
              plantDestroyed = true;
            }

            // Feld leeren
            tile.type = TileContents.Empty;
          }
        }

        // Koordinaten des Blitzes für GameOver Animation speichern
        if (plantDestroyed) {
          this._lastRemovedPlant = new Coordinates(lightningRow, lightningCol);
        }

        // Blitz anzeigen
        clonedState[lightningRow][lightningCol].type = TileContents.Lightning;

        return clonedState;
      }
    );

    {
      // Nach 1.4 Sekunden Blitz entfernen
      const timer = new Timer(1400, () => {
        this.update(
          (oldState: GridStoreContent): GridStoreContent => {
            const clonedState = cloneDeep(oldState);

            clonedState[lightningRow][lightningCol].type = TileContents.Empty;

            return clonedState;
          }
        );
      });
      this.timers.push(timer);
    }

    {
      const timer = new Timer(
        Random.between(values.lightning.spawning.min, values.lightning.spawning.max) / this._speedMultiplier,
        this.updateLightning.bind(this)
      );
      this.timers.push(timer);
    }
  }

  // Gibt ein Array mit allen Feldern zurück
  private get allTiles(): TileData[] {
    const tiles: TileData[] = [];

    // Den Inhalt aller Reihen zu einem Array hinzufügen
    for (const row of this.content) {
      tiles.push(...row);
    }

    return cloneDeep(tiles);
  }

  // Gibt die Anzahl der selbst platzierten Pflanzen an
  public get friendlyPlants(): number {
    let amount = 0;

    for (const tile of this.allTiles) {
      if (tile.type === TileContents.Plant) {
        amount++;
      }
    }

    return amount;
  }

  public get lastRemovedPlant(): Coordinates {
    return this._lastRemovedPlant;
  }
}

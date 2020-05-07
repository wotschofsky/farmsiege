import cloneDeep from 'clone-deep';
import Coordinates from '../../lib/helpers/Coordinates';
import Store from '../../lib/store/Store';

import GridUtils from '../utils/Grid';
import Random from '../utils/Random';

import TileContents from '../TileContents';
import values from '../values.json';

export type TileData = {
  type: TileContents;
  data: Record<string, string | number>;
};

export type RowData = [TileData, TileData, TileData, TileData, TileData, TileData, TileData, TileData];

export type GridStoreContent = [RowData, RowData, RowData, RowData, RowData, RowData, RowData, RowData];

const initialTile: TileData = {
  type: TileContents.Empty,
  data: {}
};

const generateInitialGrid = (): GridStoreContent => {
  const grid: RowData[] = [];
  for (let i = 0; i < 8; i++) {
    // Reihe erstellen
    const row: TileData[] = [];
    for (let j = 0; j < 8; j++) {
      const tile = cloneDeep(initialTile);
      row.push(tile);
    }
    grid.push(<RowData>row);
  }

  let plantsPlaced = 0;
  do {
    // Koordinaten zufällig auswählen
    const row = Random.roundedBetween(0, 7);
    const col = Random.roundedBetween(0, 7);

    // Verhindern, dass ein Feld doppelt verwendet wird
    if (grid[row][col].type === TileContents.Plant) {
      continue;
    }

    // Feld befüllen
    grid[row][col].type = TileContents.Plant;
    grid[row][col].data = {
      age: Math.random() * values.plant.age.maxStart
    };

    // Anzahl inkrementieren
    plantsPlaced++;
  } while (plantsPlaced < values.plant.startAmount);

  return <GridStoreContent>grid;
};

export default class GridStore extends Store<GridStoreContent> {
  private timers: NodeJS.Timeout[];
  private _speedMultiplier: number;
  private _lastRemovedPlant: Coordinates;

  public constructor() {
    const initialGrid = generateInitialGrid();
    super('grid', initialGrid);

    this.timers = [];
    this._speedMultiplier = 1;
  }

  public reset(): void {
    this.update(() => {
      const initialGrid = generateInitialGrid();
      return initialGrid;
    });
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
      const timeout = setTimeout(() => {
        this.updateMole();
      }, Random.between(values.mole.grace.min, values.mole.grace.max));
      this.timers.push(timeout);
    }

    {
      const timeout = setTimeout(() => {
        this.updateWeed();
      }, Random.between(values.weed.grace.min, values.weed.grace.max));
      this.timers.push(timeout);
    }

    {
      const timeout = setTimeout(() => {
        this.updateLightning();
      }, Random.between(values.lightning.grace.min, values.lightning.grace.max));
      this.timers.push(timeout);
    }
  }

  public stop(): void {
    // Timer löschen, um zu verhindern, dass diese Code ausführen, nachdem das Spiel vorbei ist
    for (const timer of this.timers) {
      clearTimeout(timer);
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
    const timeout = setTimeout(() => {
      this.growPlants();
    }, 100);
    this.timers.push(timeout);
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
    const timeout = setTimeout(() => {
      this.updateMole();
    }, Random.between(values.mole.spawning.min, values.mole.spawning.max) / this._speedMultiplier);
    this.timers.push(timeout);
  }

  private updateWeed(): void {
    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

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
          const row = Random.roundedBetween(0, 7);
          const col = Random.roundedBetween(0, 7);
          clonedState[row][col].type = TileContents.Weed;
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
    const timeout = setTimeout(() => {
      this.updateWeed();
    }, Random.between(values.weed.spawning.min, values.weed.spawning.max) / this._speedMultiplier);
    this.timers.push(timeout);
  }

  private updateLightning(): void {
    const lightningRow = Random.roundedBetween(0, 7);
    const lightningCol = Random.roundedBetween(0, 7);

    this.update(
      (oldState: GridStoreContent): GridStoreContent => {
        const clonedState = cloneDeep(oldState);

        let plantDestroyed = false;
        outerLoop: for (let rowIndex = -1; rowIndex <= 1; rowIndex++) {
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
              break;
            }

            // Feld leeren
            tile.type = TileContents.Empty;

            // Weitere Durchgänge verhindern, um Leistung zu sparen
            if (plantDestroyed) {
              break outerLoop;
            }
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
      const timeout = setTimeout(() => {
        this.update(
          (oldState: GridStoreContent): GridStoreContent => {
            const clonedState = cloneDeep(oldState);

            clonedState[lightningRow][lightningCol].type = TileContents.Empty;

            return clonedState;
          }
        );
      }, 1400);
      this.timers.push(timeout);
    }

    {
      const timeout = setTimeout(() => {
        this.updateLightning();
      }, Random.between(values.lightning.spawning.min, values.lightning.spawning.max) / this._speedMultiplier);
      this.timers.push(timeout);
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

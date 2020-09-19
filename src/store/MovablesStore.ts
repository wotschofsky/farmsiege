import { Directions } from '../../lib/Enums';
import cloneDeep from 'clone-deep';
import Coordinates from '../../lib/helpers/Coordinates';
import Store from '../../lib/store/Store';
import Timer from 'better-timer';

import BulletData from './models/BulletData';
import RabbitData from './models/RabbitData';

import GridUtils from '../utils/Grid';
import Random from '../utils/Random';

import values from '../values.json';

type MovablesStoreContent = {
  rabbits: RabbitData[];
};

export default class MovablesStore extends Store<MovablesStoreContent> {
  private timers: Timer[];
  private _speedMultiplier: number;

  public constructor() {
    super({
      rabbits: []
    });

    this.timers = [];
    this._speedMultiplier = 1;
  }

  public set speedMultiplier(value: number) {
    this._speedMultiplier = value;
  }

  public start(): void {
    const timer = new Timer(
      Random.between(values.rabbits.grace.min, values.rabbits.grace.max),
      this.spawnRabbits.bind(this)
    );
    this.timers.push(timer);
  }

  public stop(): void {
    // Timer löschen, um zu verhindern, dass diese Code ausführen, nachdem das Spiel vorbei ist2
    for (const timer of this.timers) {
      timer.cancel();
    }
    this.timers = [];
  }

  public updateRabbits(timeDifference: number): void {
    this.update(
      (oldState: MovablesStoreContent): MovablesStoreContent => {
        const clonedState = cloneDeep(oldState);

        // Nicht mehr sichtbare Hasen entfernen
        clonedState.rabbits = clonedState.rabbits.filter(data => {
          let outsideScreen = false;

          // Verschiedene x Werte basierend auf der Laufrichtung wählen
          if (data.direction === Directions.Left && data.x <= -256) {
            outsideScreen = true;
          } else if (data.direction === Directions.Right && data.x >= 1600) {
            outsideScreen = true;
          }

          return !outsideScreen;
        });

        for (const rabbit of clonedState.rabbits) {
          // Ermitteln, ob der Hase schon sein Ziel erreicht hat
          if (!rabbit.targetReached) {
            // Hase in Laufrichtung bewegen
            const speed = rabbit.direction === Directions.Left ? values.rabbits.speed : -values.rabbits.speed;
            const relativeX = timeDifference * speed;
            rabbit.move(relativeX);
          } else {
            // Timer des Hasen updaten
            rabbit.reduceTimeLeft(timeDifference);
          }
        }

        return clonedState;
      }
    );
  }

  public setRabbitTargets(callback: (row: number, direction: Directions, currentColumn: number) => number): void {
    this.update(
      (oldState: MovablesStoreContent): MovablesStoreContent => {
        const clonedState = cloneDeep(oldState);

        for (const rabbit of clonedState.rabbits) {
          // Feld basierend auf Koordinaten des Hasen berechnen
          const { x: currentColumn, y: rabbitRow } = GridUtils.coordsToExactField(
            new Coordinates(rabbit.x - 128, rabbit.y + 96)
          );

          // Callback Funktion aufrufen und Rückgabewert
          const targetCol = callback(rabbitRow, rabbit.direction, currentColumn);

          // Spalte in Koordinaten umrechnen und beim Hasen speichern
          rabbit.targetX = targetCol * 128 + 288 - 128;
        }

        return clonedState;
      }
    );
  }

  private spawnRabbits(): void {
    this.update(
      (oldState: MovablesStoreContent): MovablesStoreContent => {
        const clonedState = cloneDeep(oldState);

        // Menge an neuen Hasen errechnen
        const rabbitAmount = Random.roundedBetween(values.rabbits.amount.min, values.rabbits.amount.max);

        // Reihen, in den Hasen gespawnt werden ermitteln
        const rabbitRows: number[] = [];
        for (let i = 0; i < rabbitAmount; i++) {
          let row: number;
          do {
            row = Random.roundedBetween(0, 7);
            // Verhindern, dass zwei Hasen in der selben Reihe spawnen
          } while (rabbitRows.includes(row));
          rabbitRows.push(row);
        }

        // Richtung aller Hasen zufällig auswählen
        const direction = Random.randomBoolean() ? Directions.Left : Directions.Right;

        // Für jede
        const mappedRabbits: RabbitData[] = rabbitRows.map(
          (row): RabbitData => {
            // Zufälligen Offset-Wert generieren
            const offset = Random.between(0, 256);

            // Koordinaten berechnen
            let x: number;
            switch (direction) {
              case Directions.Left:
                x = 1600 + offset;
                break;
              case Directions.Right:
                x = -128 - offset;
                break;
            }
            const y = row * 128 - 96;

            return new RabbitData(x, y, direction);
          }
        );

        // Neue Hasen zu den bereits exisitieren hinzufügen
        clonedState.rabbits = clonedState.rabbits.concat(mappedRabbits);

        return clonedState;
      }
    );

    // Timer für nächsten Hasenzyklus starten
    const timer = new Timer(
      Random.between(values.rabbits.spawning.min, values.rabbits.spawning.max) / this._speedMultiplier,
      this.spawnRabbits.bind(this)
    );
    this.timers.push(timer);
  }

  public detectHit(bullets: BulletData[], callback: (x: number, y: number) => void): void {
    this.update(
      (oldState: MovablesStoreContent): MovablesStoreContent => {
        const clonedState = cloneDeep(oldState);

        // Getroffene Hasen entfernen
        clonedState.rabbits = clonedState.rabbits.filter(rabbit => {
          // Testen, ob der Hase getroffen wurde
          const rabbitHit = rabbit.detectHit(bullets);

          // Bei einem Treffer Callback ausführen
          if (rabbitHit) {
            callback(rabbit.x, rabbit.y);
          }

          return !rabbitHit;
        });

        return clonedState;
      }
    );
  }

  public get stillRabbits(): RabbitData[] {
    return this.content.rabbits.filter(rabbit => rabbit.targetReached);
  }
}

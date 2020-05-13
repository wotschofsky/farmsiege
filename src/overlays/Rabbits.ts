import { Directions } from '../../lib/Enums';
import { Template } from '../../lib/Types';
import Component from '../../lib/Component';
import Coordinates from '../../lib/helpers/Coordinates';
import PropsContext from '../../lib/PropsContext';
import Repeating, { RepeatingProps } from '../../lib/components/logical/Repeating';

import CharacterStore from '../store/CharacterStore';
import EffectsStore from '../store/EffectsStore';
import GridStore, { TileData } from '../store/GridStore';
import MovablesStore from '../store/MovablesStore';
import RabbitData from '../store/models/RabbitData';
import StatsStore from '../store/StatsStore';

import Rabbit, { RabbitProps } from '../components/animals/Rabbit';

import GridUtils from '../utils/Grid';
import TileContents from '../TileContents';
import values from '../values.json';

export type RabbitsProps = {};

export default class Rabbits extends Component<RabbitsProps> {
  protected onTick(ctx: PropsContext<RabbitsProps>, timeDifference: number): void {
    const characterStore = <CharacterStore>this.stores.character;
    const effectsStore = <EffectsStore>this.stores.effects;
    const gridStore = <GridStore>this.stores.grid;
    const movablesStore = <MovablesStore>this.stores.movables;
    const statsStore = <StatsStore>this.stores.score;

    movablesStore.setRabbitTargets((row: number, direction: Directions, currentColumn: number): number => {
      // Ausgangspunkt für Berechnung bestimmen
      let offset = Math.max(0, Math.round(currentColumn));
      if (direction === Directions.Left) {
        offset = Math.max(0, 8 - offset);
      }

      // Referenz zur Reihe des Hasen speichern
      let contentRow: TileData[] = gridStore.content[row];

      // Bei Bedarf Startpunkt ändern
      if (direction === Directions.Right) {
        contentRow = contentRow.slice(offset);
      } else {
        contentRow = contentRow.reverse().slice(offset);
      }

      // Standardziel auf der anderen Seite des Spielfeldes setzen
      let computedTarget = direction === Directions.Right ? 12 : -4;

      // Alle Felder in der ausgewählten Reihe überprüfen
      for (const index in contentRow) {
        // Testen, ob auf dem aktuellen Feld eine Pflanze ist
        if (contentRow[index].type === TileContents.Plant) {
          // Abhängig von der Richtung des Hasen Zielspalte festlegen
          if (direction === Directions.Right) {
            computedTarget = parseInt(index) + offset;
          } else {
            computedTarget = 8 - parseInt(index) - offset;
          }
          break;
        }
      }

      return computedTarget;
    });

    // Hasen bewegen und ggf. entfernen
    movablesStore.updateRabbits(timeDifference);

    // Kollision mit Geschossen erkennen
    movablesStore.detectHit(characterStore.content.bullets, (x: number, y: number) => {
      // Punkte hinzufügen & Effekte anzeigen
      statsStore.addScore(values.scores.rabbit);
      effectsStore.showSmoke(x + 96, y + 256);
      effectsStore.showScoreEffect(x + 128, y + 320, values.scores.rabbit);
    });

    movablesStore.stillRabbits.forEach(rabbit => {
      // Sobald ein Hase eine Pflanze aufgefressen hat
      if (rabbit.timeLeft === 0) {
        // Pflanze entfernen
        const coords = GridUtils.coordsToField(
          new Coordinates(rabbit.x - 288 + (rabbit.direction === Directions.Right ? 128 : 0), rabbit.y + 108)
        );
        gridStore.removeContent(coords.x, coords.y);

        // Timer des Hasen auf die Zeit zum Auffressen einer Pflanze zurücksetzen
        rabbit.resetTimer();
      }
    });
  }

  protected template: Template = [
    {
      component: new Repeating(),
      position: (): Coordinates => new Coordinates(0, 0),
      props: (): RepeatingProps => {
        const movablesStore = <MovablesStore>this.stores.movables;

        return {
          list: movablesStore.content.rabbits,
          component: (): Rabbit => new Rabbit(),
          position: (data: RabbitData): Coordinates => new Coordinates(data.x, data.y),
          props: (data: RabbitData): RabbitProps => ({
            direction: data.direction,
            moving: data.x !== data.targetX
          })
        };
      }
    }
  ];
}

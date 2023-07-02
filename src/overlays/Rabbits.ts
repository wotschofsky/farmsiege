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
      // Determine starting point for calculation
      let offset = Math.max(0, Math.round(currentColumn));
      if (direction === Directions.Left) {
        offset = Math.max(0, 8 - offset);
      }

      // Save reference to the rabbit's row
      let contentRow: TileData[] = gridStore.content[row];

      // Modify starting point if needed
      if (direction === Directions.Right) {
        contentRow = contentRow.slice(offset);
      } else {
        contentRow = contentRow.reverse().slice(offset);
      }

      // Set default target on the other side of the playing field
      let computedTarget = direction === Directions.Right ? 12 : -4;

      // Check all fields in the selected row
      for (const index in contentRow) {
        // Check if there is a plant on the current field
        if (contentRow[index].type === TileContents.Plant) {
          // Set target column based on the rabbit's direction
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

    // Move rabbits and remove if necessary
    movablesStore.updateRabbits(timeDifference);

    // Detect collision with bullets
    movablesStore.detectHit(characterStore.content.bullets, (x: number, y: number) => {
      // Add points and display effects
      statsStore.addScore(values.scores.rabbit);
      effectsStore.showSmoke(x + 96, y + 256);
      effectsStore.showScoreEffect(x + 128, y + 320, values.scores.rabbit);
    });

    movablesStore.stillRabbits.forEach(rabbit => {
      // Once a rabbit has eaten a plant
      if (rabbit.timeLeft === 0) {
        // Remove plant
        const coords = GridUtils.coordsToField(
          new Coordinates(rabbit.x - 288 + (rabbit.direction === Directions.Right ? 128 : 0), rabbit.y + 108)
        );
        gridStore.removeContent(coords.x, coords.y);

        // Reset rabbit's timer to the time it takes to eat a plant
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

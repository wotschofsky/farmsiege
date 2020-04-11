import cloneDeep from 'clone-deep';
import Store from '../../lib/store/Store';

import { ScoreData } from '../components/Highscores';

type MiscStoreContent = {
  highscores: ScoreData[];
  instructionsPage: number;
};

export default class MiscStore extends Store<MiscStoreContent> {
  public constructor() {
    super('misc', {
      highscores: [],
      instructionsPage: 1
    });
  }

  public resetInstructions(): void {
    this.update((oldState: MiscStoreContent) => {
      const clonedState = cloneDeep(oldState);

      clonedState.instructionsPage = 1;

      return clonedState;
    });
  }

  public changeInstructionsPage(newPage: number): void {
    this.update((oldState: MiscStoreContent) => {
      const clonedState = cloneDeep(oldState);

      clonedState.instructionsPage = newPage;

      return clonedState;
    });
  }

  public setHighscores(value: ScoreData[]): void {
    this.update((oldState: MiscStoreContent) => {
      const clonedState = cloneDeep(oldState);

      clonedState.highscores = value;

      return clonedState;
    });
  }

  public async fetchHighscores(): Promise<void> {
    const response = await fetch(
      'https://garden-defense.firebaseio.com/highscores.json?orderBy="score"&limitToLast=10'
    );
    const json = await response.json();

    const scores: ScoreData[] = [];
    for (const score in json) {
      scores.push(json[score]);
    }

    const sorted = scores.sort((a, b): number => {
      if (a.score < b.score) return 1;
      if (a.score > b.score) return -1;
      return 0;
    });

    this.setHighscores(sorted);
  }
}

import cloneDeep from 'clone-deep';
import Store from '../../lib/store/Store';

import { ScoreData } from '../components/Highscores';
import Random from '../utils/Random';
import tips from '../tips.json';

type MiscStoreContent = {
  highscores: ScoreData[];
  instructionsPage: number;
  instructionsMode: 'manual' | 'beforeGame';
  splashScreenShowing: boolean;
  recaptchaLoaded: boolean;
  displayedTip: string;
};

export default class MiscStore extends Store<MiscStoreContent> {
  public constructor() {
    const searchParams = new URLSearchParams(window.location.search);

    super({
      highscores: [],
      instructionsPage: 1,
      instructionsMode: 'manual',
      splashScreenShowing: !searchParams.has('skipSplash'),
      recaptchaLoaded: false,
      displayedTip: Random.randomElement(tips)
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

  public setInstructionsMode(newMode: 'manual' | 'beforeGame'): void {
    this.update((oldState: MiscStoreContent) => {
      const clonedState = cloneDeep(oldState);

      clonedState.instructionsMode = newMode;

      return clonedState;
    });
  }

  public async fetchHighscores(): Promise<void> {
    // Send HTTP request to the highscore server
    const response = await fetch('/api/highscores');

    if (!response.ok) {
      return
    }

    // Extract the response in JSON format
    const scores: ScoreData[] = await response.json();

    // Sort the scores
    const sorted = scores.sort((a: ScoreData, b: ScoreData): number => b.score - a.score);

    // Save the highscores in the store
    this.update((oldState: MiscStoreContent) => {
      const clonedState = cloneDeep(oldState);

      clonedState.highscores = sorted;

      return clonedState;
    });
  }

  public setSplashScreenShown(): void {
    this.update((oldState: MiscStoreContent) => {
      const clonedState = cloneDeep(oldState);

      clonedState.splashScreenShowing = false;

      return clonedState;
    });
  }

  public setRecaptchaLoaded(): void {
    this.update((oldState: MiscStoreContent) => {
      const clonedState = cloneDeep(oldState);

      clonedState.recaptchaLoaded = true;

      return clonedState;
    });
  }

  public updateTip(): void {
    this.update((oldState: MiscStoreContent) => {
      const clonedState = cloneDeep(oldState);

      const oldTip = clonedState.displayedTip;
      let newTip: string;
      do {
        newTip = Random.randomElement(tips);
        // Avoid displaying the same tip twice in a row
      } while (newTip === oldTip);

      clonedState.displayedTip = newTip;

      return clonedState;
    });
  }
}

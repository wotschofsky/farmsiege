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
    super({
      highscores: [],
      instructionsPage: 1,
      instructionsMode: 'manual',
      splashScreenShowing: true,
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
    // HTTP Anfrage an Highscore Server schicken
    const response = await fetch(
      'https://garden-defense.firebaseio.com/highscores.json?orderBy="score"&limitToLast=10'
    );

    // Antwort im JSON Format extrahieren
    const json = await response.json();

    // Antwort im Objektformat in Array umwandeln
    const scores: ScoreData[] = [];
    for (const score in json) {
      scores.push(json[score]);
    }

    // Ergebnisse sortieren
    const sorted = scores.sort((a: ScoreData, b: ScoreData): number => b.score - a.score);

    // Highscores im Store speichern
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
        // Vermeiden, dass der selbe Tipp zweimal hintereinander angezeigt wird
      } while (newTip === oldTip);

      clonedState.displayedTip = newTip;

      return clonedState;
    });
  }
}

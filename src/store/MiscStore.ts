import Store from '../../lib/store/Store';
import cloneDeep from 'clone-deep';

type MiscStoreContent = {
  instructionsPage: number;
};

export default class MiscStore extends Store<MiscStoreContent> {
  public constructor() {
    super('misc', {
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
}

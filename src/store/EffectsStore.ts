import cloneDeep from 'clone-deep';
import Store from '../../lib/store/Store';

import EffectData from './effects/EffectData';
import ScoreEffectData from './effects/ScoreEffectData';
import Coordinates from '../../lib/helpers/Coordinates';

type EffectsStoreContent = {
  smoke: EffectData[];
  scores: ScoreEffectData[];
};

export default class EffectsStore extends Store<EffectsStoreContent> {
  public constructor() {
    super('effects', {
      smoke: [],
      scores: []
    });
  }

  public showSmoke(x: number, y: number): void {
    this.update(oldState => {
      const clonedState = cloneDeep(oldState);

      const position = new Coordinates(x, y);
      const smoke = new EffectData(position);
      clonedState.smoke.push(smoke);

      return clonedState;
    });
  }

  public showScoreEffect(x: number, y: number, value: number): void {
    this.update(oldState => {
      const clonedState = cloneDeep(oldState);

      const position = new Coordinates(x, y);
      const effect = new ScoreEffectData(position, value);
      clonedState.scores.push(effect);

      return clonedState;
    });
  }

  public updateEffects(timeDifference: number): void {
    this.update(oldState => {
      const clonedState = cloneDeep(oldState);

      clonedState.smoke.forEach(smoke => {
        smoke.reduceRemainingTime(timeDifference);
      });

      clonedState.smoke = clonedState.smoke.filter(smoke => {
        return !smoke.expired;
      });

      clonedState.scores.forEach(score => {
        score.increaseTimer(timeDifference);
      });

      clonedState.scores = clonedState.scores.filter(score => {
        return !score.expired;
      });

      return clonedState;
    });
  }
}

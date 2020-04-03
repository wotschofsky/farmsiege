import cloneDeep from 'clone-deep';
import eases from 'eases';
import Store from '../../lib/store/Store';

import EffectData from './effects/EffectData';
import ScoreEffectData from './effects/ScoreEffectData';
import Coordinates from '../../lib/helpers/Coordinates';

type EffectsStoreContent = {
  smoke: EffectData[];
  scores: ScoreEffectData[];
  gameOver: {
    active: boolean;
    timer: number;
    center: Coordinates;
  };
};

export default class EffectsStore extends Store<EffectsStoreContent> {
  public constructor() {
    super('effects', {
      smoke: [],
      scores: [],
      gameOver: {
        active: false,
        timer: 0,
        center: new Coordinates(0, 0)
      }
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

  public showGameOverAnimation(center: Coordinates, callback: () => void): void {
    this.update(oldState => {
      const clonedState = cloneDeep(oldState);

      clonedState.gameOver.active = true;
      clonedState.gameOver.center = center;

      setTimeout(callback, 1200);

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

      if (clonedState.gameOver.timer > 1500) {
        clonedState.gameOver.active = false;
        clonedState.gameOver.timer = 0;
      }

      if (clonedState.gameOver.active) {
        clonedState.gameOver.timer += timeDifference;
      }

      return clonedState;
    });
  }

  public get endAnimationProgress(): number {
    const animationDuration = 1000;
    const timer = this.directContent.gameOver.timer;

    if (timer >= animationDuration) {
      return 1;
    }

    const pauseOffset = 0.92;

    if (timer <= animationDuration * 0.5) {
      return eases.expoOut(timer / (animationDuration * 0.5)) * pauseOffset;
    } else if (timer < animationDuration * 0.75) {
      return pauseOffset;
    } else if (timer < animationDuration * 1) {
      return pauseOffset + eases.expoInOut(1 - (animationDuration - timer) / 250) * (1 - pauseOffset);
    } else {
      return 1;
    }
  }
}

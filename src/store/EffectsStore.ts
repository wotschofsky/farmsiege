import cloneDeep from 'clone-deep';
import Coordinates from '../../lib/helpers/Coordinates';
import eases from 'eases';
import Store from '../../lib/store/Store';
import Timer from 'better-timer';

import EffectData from './effects/EffectData';
import ScoreEffectData from './effects/ScoreEffectData';

import values from '../values.json';

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
    super({
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
    this.update((oldState) => {
      const clonedState = cloneDeep(oldState);

      const position = new Coordinates(x, y);
      const smoke = new EffectData(position);
      clonedState.smoke.push(smoke);

      return clonedState;
    });
  }

  public showScoreEffect(x: number, y: number, value: number): void {
    this.update((oldState) => {
      const clonedState = cloneDeep(oldState);

      const position = new Coordinates(x, y);
      const effect = new ScoreEffectData(position, value);
      clonedState.scores.push(effect);

      return clonedState;
    });
  }

  public showGameOverAnimation(center: Coordinates, callback: () => void): void {
    this.update((oldState) => {
      const clonedState = cloneDeep(oldState);

      clonedState.gameOver.active = true;
      clonedState.gameOver.center = center;

      new Timer(values.animations.gameOver.duration + 250, callback);

      return clonedState;
    });
  }

  public updateEffects(timeDifference: number): void {
    this.update((oldState) => {
      const clonedState = cloneDeep(oldState);

      // Update timer for all effects
      clonedState.smoke.forEach((smoke) => {
        smoke.reduceRemainingTime(timeDifference);
      });

      // Remove expired effects
      clonedState.smoke = clonedState.smoke.filter((smoke) => {
        return !smoke.expired;
      });

      clonedState.scores.forEach((score) => {
        score.increaseTimer(timeDifference);
      });

      clonedState.scores = clonedState.scores.filter((score) => {
        return !score.expired;
      });

      // Reset gameOver timer
      if (clonedState.gameOver.timer > values.animations.gameOver.duration + 500) {
        clonedState.gameOver.active = false;
        clonedState.gameOver.timer = 0;
      }

      // Increase timer for gameOver if animation is active
      if (clonedState.gameOver.active) {
        clonedState.gameOver.timer += timeDifference;
      }

      return clonedState;
    });
  }

  public get endAnimationProgress(): number {
    const { duration: animationDuration, pauseOffset, endFirstSegment, endSecondSegment } = values.animations.gameOver;

    const { timer } = this.content.gameOver;

    if (timer >= animationDuration) {
      return 1;
    }

    if (timer <= animationDuration * endFirstSegment) {
      // Play majority of the animation in the first short phase
      return eases.expoOut(timer / (animationDuration * endFirstSegment)) * pauseOffset;
    } else if (timer < animationDuration * endSecondSegment) {
      // Pause
      return pauseOffset;
    } else if (timer < animationDuration * 1) {
      // Quickly close the last visible area
      return pauseOffset + eases.expoInOut(1 - (animationDuration - timer) / 250) * (1 - pauseOffset);
    } else {
      // If the animation is completed
      return 1;
    }
  }
}

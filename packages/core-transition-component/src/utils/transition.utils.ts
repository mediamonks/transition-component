import gsap from 'gsap';
import type {
  SetupTimelineOptions,
  SetupTransitionOptions,
  TransitionController,
  TransitionDirection,
  TransitionOptions,
} from '../types/transition.types';
import { clearTimeline, cloneTimeline } from './timeline.utils';

/**
 * Creates the TransitionController
 *
 * TODO: Check if we can extract more functions from the inner scope so that tree-shaking can be more efficient
 *
 * @param setupOptions
 * @returns
 */
export function createTransitionController<R>(
  setupOptions: SetupTransitionOptions<R>,
): TransitionController {
  let transitionPromise = Promise.resolve();
  let resolveTransitionPromise: null | (() => void) = null;

  const transitionTimeline: Record<TransitionDirection, gsap.core.Timeline> = {
    in: gsap.timeline({
      paused: true,
      ...setupOptions.timelineVars,
    }),
    out: gsap.timeline({
      paused: true,
    }),
  };

  const onTransitionStart = (direction: TransitionDirection, callback?: () => void): void => {
    setupOptions.onStart?.(direction);
    callback?.();
  };

  const onTransitionComplete = <T extends TransitionDirection>(
    direction: T,
    callback?: (transitionDirection: T) => void,
  ): void => {
    setupOptions.onComplete?.(direction);
    callback?.(direction);

    if (resolveTransitionPromise) {
      resolveTransitionPromise();
      resolveTransitionPromise = null;
    }
  };

  transitionTimeline.in.eventCallback('onStart', () => onTransitionStart('in'));
  transitionTimeline.in.eventCallback('onComplete', () => onTransitionComplete('in'));
  transitionTimeline.in.eventCallback('onReverseComplete', () => onTransitionComplete('out'));
  transitionTimeline.in.eventCallback('onUpdate', () =>
    setupOptions.onUpdate?.(transitionTimeline.in),
  );

  transitionTimeline.out.eventCallback('onStart', () => onTransitionStart('out'));
  transitionTimeline.out.eventCallback('onComplete', () => onTransitionComplete('out'));
  transitionTimeline.out.eventCallback('onUpdate', () =>
    setupOptions.onUpdate?.(transitionTimeline.out),
  );

  // Helper method to retrieve the correct setup method based on the direction
  const getSetupMethod = (direction: TransitionDirection = 'in') =>
    setupOptions[direction === 'in' ? 'setupTransitionInTimeline' : 'setupTransitionOutTimeline'];

  const killOldTimeline = (direction: TransitionDirection) => {
    if (!transitionPromise) {
      return;
    }

    const hasOutTimeline = transitionTimeline.out.getChildren(true).length > 0;
    const timeline = transitionTimeline[direction === 'in' && hasOutTimeline ? 'out' : 'in'];

    timeline.kill();

    if (resolveTransitionPromise) {
      onTransitionComplete(direction);
    }
  };

  const controller = {
    transitionTimeline,
    getTimeline(direction: TransitionDirection = 'in') {
      if (direction === 'out') {
        this.setupTimeline({
          direction,
        });
      }

      return cloneTimeline(transitionTimeline[direction], direction).play();
    },
    // eslint-disable-next-line no-shadow
    setupTimeline(options: Partial<SetupTimelineOptions> = {}) {
      const { direction, timeline, reset }: SetupTimelineOptions = {
        direction: 'in',
        timeline: transitionTimeline[options.direction || 'in'],
        reset: false,
        ...options,
      };

      if (reset) clearTimeline(timeline);

      // Find the correct setup based on the provided direction
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      getSetupMethod(direction)?.(timeline, setupOptions.refs!);

      return timeline;
    },
    async transition<T extends TransitionDirection>(options: TransitionOptions<T>) {
      killOldTimeline(options.direction);

      transitionPromise = new Promise((resolve) => {
        resolveTransitionPromise = resolve as () => void;

        const timeline = transitionTimeline[options.direction];
        const timelineHasChildren = timeline.getChildren(true).length > 0;

        options.onStart?.(options.direction);

        if (options.direction === 'in' || (options.direction === 'out' && timelineHasChildren)) {
          // eslint-disable-next-line babel/no-unused-expressions
          !timelineHasChildren && onTransitionComplete('in' as T, options.onComplete);
          timeline.restart(true, true);
        } else {
          transitionTimeline.in.reverse(0, true);
        }
      }).then(() => options.onComplete?.(options.direction));

      return transitionPromise;
    },
    async transitionIn(options?: Omit<TransitionOptions<'in'>, 'direction'>) {
      if (options?.reset) {
        this.setupTimeline({
          direction: 'in',
          reset: true,
        });
      }

      await this.transition({
        ...options,
        direction: 'in',
      });
    },
    async transitionOut(options?: Omit<TransitionOptions<'out'>, 'direction'>) {
      if (options?.reset || transitionTimeline.out.getChildren(true).length === 0) {
        this.setupTimeline({
          direction: 'out',
          reset: true,
        });
      }

      await this.transition({
        ...options,
        direction: 'out',
      });
    },
  };

  return controller;
}

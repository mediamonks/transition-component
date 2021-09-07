import gsap from 'gsap';
import type {
  SetupTransitionOptions,
  TimelineOptions,
  TransitionController,
  TransitionDirection,
  TransitionInOptions,
  TransitionOptions,
  TransitionOutOptions,
} from '../types/transition.types';
import { clearTimeline, cloneTimeline } from './timeline.utils';

export function getTransitionController(
  setupOptions: SetupTransitionOptions = {},
): TransitionController {
  let transitionPromise = Promise.resolve();
  let resolveTransitionPromise: null | (() => void) = null;

  const transitionTimeline: Record<TransitionDirection, gsap.core.Timeline> = {
    in: gsap.timeline({
      paused: true,
      scrollTrigger: setupOptions.scrollTrigger,
    }),
    out: gsap.timeline({
      paused: true,
    }),
  };

  const onTransitionStart = (direction: TransitionDirection, callback?: () => void): void => {
    setupOptions.onStart?.(direction);
    callback?.();
  };

  const onTransitionComplete = (
    direction: TransitionDirection,
    callback?: (transitionDirection: TransitionDirection) => void,
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
    if (!transitionPromise) return;

    const hasOutTimeline = transitionTimeline.out.getChildren(true).length > 0;
    const timeline = transitionTimeline[direction === 'in' && hasOutTimeline ? 'out' : 'in'];

    timeline.kill();

    if (resolveTransitionPromise) onTransitionComplete(direction);
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
    setupTimeline(options: Partial<TimelineOptions> = {}) {
      const { direction, timeline, reset }: TimelineOptions = {
        direction: 'in',
        timeline: transitionTimeline[options.direction || 'in'],
        reset: false,
        ...options,
      };

      if (reset) clearTimeline(timeline);

      // Find the correct setup based on the provided direction
      getSetupMethod(direction)?.(timeline);

      return timeline;
    },
    async transition(options: TransitionOptions) {
      killOldTimeline(options.direction);

      transitionPromise = new Promise((resolve) => {
        resolveTransitionPromise = resolve as () => void;

        const timeline = transitionTimeline[options.direction];
        const timelineHasChildren = timeline.getChildren(true).length > 0;

        options.onStart?.(options.direction);

        if (options.direction === 'in' || (options.direction === 'out' && timelineHasChildren)) {
          // eslint-disable-next-line babel/no-unused-expressions
          !timelineHasChildren && onTransitionComplete('in', options.onComplete);
          timeline.restart(true, true);
        } else {
          transitionTimeline.in.reverse(0, true);
        }
      }).then(() => options.onComplete?.(options.direction));

      return transitionPromise;
    },
    async transitionIn(options: TransitionInOptions = {}) {
      if (options.reset) {
        this.setupTimeline({ direction: 'in', reset: true });
      }

      await this.transition({ ...options, direction: 'in' });
    },
    async transitionOut(options: TransitionOutOptions = {}) {
      if (options.reset || transitionTimeline.out.getChildren(true).length === 0) {
        this.setupTimeline({ direction: 'out', reset: true });
      }

      await this.transition({ ...options, direction: 'out' });
    },
  };

  return controller;
}

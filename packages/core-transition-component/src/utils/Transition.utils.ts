import gsap from 'gsap';

import type {
  SetupSignatureElements,
  SetupTransitionOptions,
  TimelineOptions,
  TransitionController,
  TransitionDirection,
  TransitionInOptions,
  TransitionOptions,
  TransitionOutOptions,
  TransitionRef,
} from '../types/Transition.types';
import type { AbstractTransitionContext } from '../context/AbstractTransitionContext';
import { clearTimeline, cloneTimeline } from './Timeline.utils';

export function getTransitionController<
  T extends Record<string, R>,
  R extends TransitionRef,
  E extends SetupSignatureElements<T>
>(
  container: R,
  setupOptions: SetupTransitionOptions<T, R, E> = {},
  transitionRefToElement: (ref: R) => HTMLElement | Array<HTMLElement> | undefined,
  transitionContext?: AbstractTransitionContext<R>,
): TransitionController {
  // eslint-disable-next-line no-param-reassign
  setupOptions = { registerTransitionController: true, ...setupOptions };

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

  // Helper method to retrieve the correct setup method based on the direction
  const getSetupMethod = (direction: TransitionDirection = 'in') =>
    setupOptions[direction === 'in' ? 'setupTransitionInTimeline' : 'setupTransitionOutTimeline'];

  // eslint-disable-next-line no-shadow
  const removeEventListeners = (timeline: gsap.core.Timeline) => {
    timeline.eventCallback('onComplete', null);
    timeline.eventCallback('onReverseComplete', null);
    timeline.eventCallback('onUpdate', null);
  };

  // eslint-disable-next-line no-shadow
  const handleTransitionComplete = (timeline: gsap.core.Timeline) => {
    removeEventListeners(timeline);

    setupOptions.onComplete?.();

    if (resolveTransitionPromise) {
      resolveTransitionPromise();
      resolveTransitionPromise = null;
    }
  };

  const killOldTimeline = (direction: TransitionDirection) => {
    if (!transitionPromise) return;

    const hasOutTimeline = transitionTimeline.out.getChildren(true).length > 0;
    const timeline = transitionTimeline[direction === 'in' && hasOutTimeline ? 'out' : 'in'];

    timeline.kill();

    handleTransitionComplete(timeline);
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

      if (transitionContext === undefined) {
        throw new Error('No TransitionContext has been found, make sure the Apps holds one.');
      }

      if (reset) clearTimeline(timeline);

      // Find the correct setup based on the provided direction
      getSetupMethod(direction)?.(
        timeline,
        Object.entries(setupOptions.refs || {}).reduce(
          (refs, [key, value]) => {
            // Object.entries causes key to be too generic.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            refs[key] = transitionRefToElement(value as TransitionRef); // eslint-disable-line no-param-reassign
            return refs;
          },
          {
            container: transitionRefToElement(container),
          } as E,
        ),
        transitionContext,
      );

      return timeline;
    },
    async transition(options: TransitionOptions) {
      killOldTimeline(options.direction);

      transitionPromise = new Promise((resolve) => {
        resolveTransitionPromise = resolve;

        const timeline = transitionTimeline[options.direction];
        const timelineHasChildren = timeline.getChildren(true).length > 0;

        setupOptions.onStart?.();

        if (options.direction === 'in' || (options.direction === 'out' && timelineHasChildren)) {
          // eslint-disable-next-line babel/no-unused-expressions
          !timelineHasChildren && handleTransitionComplete(timeline);

          timeline
            .eventCallback('onComplete', handleTransitionComplete, [timeline])
            .restart(true, false);
        } else {
          const reversedTimeline = transitionTimeline.in;

          reversedTimeline
            .eventCallback('onReverseComplete', handleTransitionComplete, [
              reversedTimeline,
              'reverse',
            ])
            .reverse();
        }
      });

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

  if (container === undefined) {
    throw new Error(
      'Unable to register the transition controller because the root element is not set',
    );
  }

  if (setupOptions.registerTransitionController) {
    // Register the transition controller on the context so we can access it from anywhere within the application.
    transitionContext?.register(container, controller);
  }

  return controller;
}

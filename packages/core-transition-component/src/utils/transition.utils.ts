import gsap from 'gsap';
import type { AbstractTransitionContext } from '../context/AbstractTransitionContext';
import type {
  SetupSignatureElements,
  SetupTransitionOptions,
  SetupTransitionSignature,
  TimelineOptions,
  TransitionController,
  TransitionDirection,
  TransitionInOptions,
  TransitionOptions,
  TransitionOutOptions,
  TransitionRef,
} from '../types/transition.types';
import { clearTimeline, cloneTimeline } from './timeline.utils';

function noop(): undefined {
  return undefined;
}

export function getTransitionController<
  T extends Record<string, R>,
  R extends TransitionRef,
  E extends SetupSignatureElements<T>
>(
  container: R,
  setupOptions: SetupTransitionOptions<T, R, E> = {},
  transitionRefToElement: (ref: R) => HTMLElement | Array<HTMLElement> | undefined = noop,
  // eslint-disable-next-line unicorn/no-useless-undefined
  transitionContext: AbstractTransitionContext<R> | undefined = undefined,
): TransitionController | null {
  // If the provided container element does not exist in the DOM we do not setup any logic.
  if (!transitionRefToElement(container)) {
    return null;
  }

  // eslint-disable-next-line no-param-reassign
  setupOptions = {
    registerTransitionController: true,
    ...setupOptions,
  };

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

  transitionTimeline.in.eventCallback('onStart', () => {
    onTransitionStart('in');
  });
  transitionTimeline.in.eventCallback('onComplete', () => {
    onTransitionComplete('in');
  });
  transitionTimeline.in.eventCallback('onReverseComplete', () => {
    onTransitionComplete('out');
  });
  transitionTimeline.in.eventCallback('onUpdate', () =>
    setupOptions.onUpdate?.(transitionTimeline.in),
  );
  transitionTimeline.out.eventCallback('onStart', () => {
    onTransitionStart('out');
  });
  transitionTimeline.out.eventCallback('onComplete', () => {
    onTransitionComplete('out');
  });
  transitionTimeline.out.eventCallback('onUpdate', () =>
    setupOptions.onUpdate?.(transitionTimeline.out),
  );

  // Helper method to retrieve the correct setup method based on the direction
  function getSetupMethod(
    direction: TransitionDirection = 'in',
  ): SetupTransitionSignature<T, R, E> | undefined {
    return setupOptions[
      direction === 'in' ? 'setupTransitionInTimeline' : 'setupTransitionOutTimeline'
    ];
  }

  function killOldTimeline(direction: TransitionDirection): void {
    const hasOutTimeline = transitionTimeline.out.getChildren(true).length > 0;
    const timeline = transitionTimeline[direction === 'in' && hasOutTimeline ? 'out' : 'in'];

    timeline.kill();

    if (resolveTransitionPromise) {
      onTransitionComplete(direction);
    }
  }

  const controller = {
    transitionTimeline,
    getTimeline(direction: TransitionDirection = 'in'): gsap.core.Timeline {
      if (direction === 'out') {
        this.setupTimeline({
          direction,
        });
      }

      return cloneTimeline(transitionTimeline[direction], direction).play();
    },
    resetTimeline(direction: TransitionDirection): gsap.core.Timeline {
      const timeline = this.setupTimeline({
        direction,
        reset: true,
      });

      // This is not mentioned in the docs, but the method does actually reset the `scrollTrigger` instance and fixes
      // the issue with re-triggering the scroll events.
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        timeline.scrollTrigger.update(true);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Unable to reset the scrollTrigger instance.', error);
      }

      return timeline;
    },
    // eslint-disable-next-line no-shadow
    setupTimeline(options: Partial<TimelineOptions> = {}): gsap.core.Timeline {
      const { direction, timeline, reset }: TimelineOptions = {
        direction: 'in',
        timeline: transitionTimeline[options.direction ?? 'in'],
        reset: false,
        ...options,
      };

      if (transitionContext === undefined) {
        throw new Error('No TransitionContext has been found, make sure the Apps holds one.');
      }

      if (reset) {
        clearTimeline(timeline);
      }

      const elements: E = {
        container: transitionRefToElement(container),
      } as E;

      for (const key in setupOptions.refs) {
        if (Object.hasOwn(setupOptions.refs, key)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          elements[key] = transitionRefToElement(setupOptions.refs[key]);
        }
      }

      // Find the correct setup based on the provided direction
      getSetupMethod(direction)?.(timeline, elements, transitionContext);

      return timeline;
    },
    async transition(options: TransitionOptions): Promise<void> {
      killOldTimeline(options.direction);

      transitionPromise = new Promise((resolve) => {
        resolveTransitionPromise = resolve as () => void;

        const timeline = transitionTimeline[options.direction];
        const timelineHasChildren = timeline.getChildren(true).length > 0;

        options.onStart?.(options.direction);

        const outTimelineHasChildren = options.direction === 'out' && timelineHasChildren;

        if (options.direction === 'in' || outTimelineHasChildren) {
          if (!timelineHasChildren) {
            onTransitionComplete('in', options.onComplete);
          }

          timeline.restart(true, true);
        } else {
          transitionTimeline.in.reverse(0, true);
        }
      }).then(() => options.onComplete?.(options.direction));

      return transitionPromise;
    },
    async transitionIn(options: TransitionInOptions = {}): Promise<void> {
      if (options.reset) {
        this.setupTimeline({ direction: 'in', reset: true });
      }

      await this.transition({ ...options, direction: 'in' });
    },
    async transitionOut(options: TransitionOutOptions = {}): Promise<void> {
      if (options.reset || transitionTimeline.out.getChildren(true).length === 0) {
        this.setupTimeline({ direction: 'out', reset: true });
      }

      await this.transition({ ...options, direction: 'out' });
    },
  };

  if (setupOptions.registerTransitionController) {
    // Register the transition controller on the context so we can access it from anywhere within the application.
    transitionContext?.register(container, controller);
  }

  return controller;
}

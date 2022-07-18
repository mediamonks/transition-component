import gsap from 'gsap';
import type {
  BindProps,
  CollectionRef,
  ComponentFactory,
  ComponentRef,
  ComponentsRef,
  ElementRef,
  RefElementType,
} from '@muban/muban';
import type {
  SetupTimelineOptions,
  SetupTransitionOptions,
  TransitionController,
  TransitionDirection,
  TransitionOptions,
  TransitionOptionsWithDirection,
} from '../types/transition.types';
import { clearTimeline } from './timeline.utils';

/**
 * Creates the TransitionController
 *
 * @param setupOptions
 * @returns
 */
export function createTransitionController<T>(
  setupOptions: SetupTransitionOptions<T>,
): TransitionController {
  const timelines: Record<TransitionDirection, gsap.core.Timeline | undefined> = {
    in: undefined,
    out: undefined,
  };

  const controller: TransitionController = {
    ref: setupOptions.ref,

    /**
     * Function to get one of the timelines
     */
    getTimeline(direction: TransitionDirection): gsap.core.Timeline | undefined {
      return timelines[direction];
    },

    /**
     * Create timeline for given direction
     */
    setupTimeline({ direction, reset }: SetupTimelineOptions) {
      const setupTimelineFunction =
        direction === 'in'
          ? setupOptions.setupTransitionInTimeline
          : setupOptions.setupTransitionOutTimeline;

      if (setupTimelineFunction == null) {
        throw new Error(
          `Cannot setup timeline because no setup function is defined for '${direction}' direction`,
        );
      }

      let timelineVariables: gsap.TimelineVars = {
        paused: true,
      };

      if (direction === 'in') {
        // Allow external timeline variables for transition in timeline
        timelineVariables = {
          ...setupOptions.timelineVars?.(),
          ...timelineVariables,
        };
      }

      let timeline = timelines[direction];

      if (timeline == null) {
        timeline = gsap.timeline(timelineVariables);

        // Save new timeline for direction
        timelines[direction] = timeline;

        timeline.eventCallback('onStart', () => setupOptions.onStart?.(direction));
        timeline.eventCallback('onComplete', () => setupOptions.onComplete?.(direction));

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        timeline.eventCallback('onUpdate', () => setupOptions.onUpdate?.(timeline!));

        if (direction === 'in') {
          timeline.eventCallback('onReverseComplete', () => setupOptions.onComplete?.(direction));
        }
      }
      // Reset timeline when timeline exist and reset option is enabled
      else if (reset) {
        clearTimeline(timeline);
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setupTimelineFunction(timeline, setupOptions.refs!);

      return timeline;
    },

    /**
     * Start transition for given direction from options
     */
    async transition(options: TransitionOptionsWithDirection) {
      // Transition in timeline is used as a fallback if the out timeline does
      // not exist. The transition in timeline is reversed if the fallback is used
      const timeline = timelines[options.direction] ?? timelines.in;

      if (timeline == null) {
        throw new Error(
          'Timeline is undefined, did you forget to call TransitionController.setupTimeline()?',
        );
      }

      // Timeline should be restarted, the old timeline is killed in case it's active
      timeline.kill();

      options.onStart?.(options.direction);

      // Reverse in transition when out timeline is empty
      if (options.direction === 'out' && timelines.out == null) {
        await timeline.reverse(0, true);
      } else {
        await timeline.restart(true, true);
      }

      options.onComplete?.(options.direction);
      setupOptions.onComplete?.(options.direction);
    },

    /**
     * Shorthand to start transition in
     */
    async transitionIn(options?: TransitionOptions) {
      await this.transition({
        ...options,
        direction: 'in',
      });
    },

    /**
     * Shorthand to start transition out
     */
    async transitionOut(options?: TransitionOptions) {
      await this.transition({
        ...options,
        direction: 'out',
      });
    },
  } as const;

  return controller;
}

export function unwrapRefs<
  T extends Record<
    string,
    | ElementRef<RefElementType, BindProps>
    | CollectionRef<RefElementType, BindProps>
    | ComponentRef<ComponentFactory>
    | ComponentsRef<ComponentFactory>
  >
>(
  refs: T,
): {
  [U in keyof T]: T[U] extends ElementRef<infer E>
    ? E
    : T[U] extends CollectionRef<infer E>
    ? ReadonlyArray<E>
    : T[U] extends ComponentsRef<ComponentFactory>
    ? // The component ref doesn't support generic element types, therefore we just return HTMLElement like the library.
      ReadonlyArray<HTMLElement>
    : HTMLElement;
} {
  return Object.entries(refs).reduce((accumulator, [key, ref]) => {
    if (ref.type === 'collection') {
      accumulator[key] = [...ref.getElements()];
    }

    if (ref.type === 'componentCollection') {
      accumulator[key] = [...ref.getComponents().map((component) => component?.element)];
    }

    if (ref.type === 'component') {
      accumulator[key] = ref.component?.element;
    }

    if (ref.type === 'element') {
      accumulator[key] = ref?.element;
    }

    return accumulator;
  }, {} as any); // eslint-disable-line @typescript-eslint/no-explicit-any
}

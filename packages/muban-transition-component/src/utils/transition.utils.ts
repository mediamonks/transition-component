import gsap from 'gsap';
import type {
  SetupTimelineOptions,
  SetupTransitionOptions,
  TransitionController,
  TransitionDirection,
  TransitionOptions,
  TransitionOptionsWithDirection,
} from '../types/transition.types';
import { clearTimeline, cloneTimeline } from './timeline.utils';

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
     * Function to get one of the timelines, not the secondary argument where you can define if you want the source
     * timeline instead of a clone. In most cases you want to retrieve a clone of the original timeline,
     * for example when nesting timelines within other timelines
     */
    getTimeline(
      direction: TransitionDirection,
      isSourceTimeline?: boolean,
    ): gsap.core.Timeline | undefined {
      if (isSourceTimeline) return timelines[direction];
      return cloneTimeline(timelines[direction], direction)?.play();
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

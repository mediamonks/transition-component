export type GuardFunction = (release: () => void) => void;
export type TransitionDirection = 'in' | 'out';

export interface SetupTimelineOptions {
  direction: TransitionDirection;
  reset?: boolean;
  timeline?: gsap.core.Timeline;
}

export interface TransitionOptionEventHandlers<T = TransitionDirection> {
  onStart?: (direction: T) => void;
  onComplete?: (direction: T) => void;
  onUpdate?: (timeline: gsap.core.Timeline) => void;
}

export interface TransitionOptions<T extends TransitionDirection>
  extends TransitionOptionEventHandlers<T> {
  direction: T;
  reset?: boolean;
}

export interface TransitionController<T = undefined> {
  ref?: T;
  transitionTimeline: Record<TransitionDirection, gsap.core.Timeline>;
  getTimeline(direction?: TransitionDirection): gsap.core.Timeline;
  setupTimeline(options?: Partial<SetupTimelineOptions>): gsap.core.Timeline;
  transition(options: TransitionOptions<TransitionDirection>): Promise<void>;
  transitionIn(options?: Omit<TransitionOptions<'in'>, 'direction'>): Promise<void>;
  transitionOut(options?: Omit<TransitionOptions<'out'>, 'direction'>): Promise<void>;
}

export interface SetupTransitionOptions<T = undefined> extends TransitionOptionEventHandlers {
  ref?: unknown;
  refs: T;
  timelineVars?: gsap.TimelineVars;
  setupTransitionInTimeline?: (timeline: gsap.core.Timeline, refs: T) => void;
  setupTransitionOutTimeline?: (timeline: gsap.core.Timeline, refs: T) => void;
}

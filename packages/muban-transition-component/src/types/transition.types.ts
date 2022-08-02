import type { ComponentFactory, ComponentRef, ElementRef } from '@muban/muban';
import type { gsap } from 'gsap';

export type GuardFunction = (release: () => void) => void;
export type TransitionDirection = 'in' | 'out';

export interface SetupTimelineOptions {
  direction: TransitionDirection;
  reset?: boolean;
}

export interface TransitionOptionEventHandlers<T = TransitionDirection> {
  onStart?: (direction: T) => void;
  onComplete?: (direction: T) => void;
  onUpdate?: (timeline: gsap.core.Timeline) => void;
}

export interface TransitionOptions extends TransitionOptionEventHandlers {
  reset?: boolean;
}

export interface TransitionOptionsWithDirection extends TransitionOptions {
  direction: TransitionDirection;
}

export interface TransitionController {
  ref?: ElementRef | ComponentRef<ComponentFactory>;
  getTimeline(direction?: TransitionDirection, isSource?: boolean): gsap.core.Timeline | undefined;
  setupTimeline(options?: SetupTimelineOptions): gsap.core.Timeline;
  transition(options: TransitionOptionsWithDirection): Promise<void>;
  transitionIn(options?: TransitionOptions): Promise<void>;
  transitionOut(options?: TransitionOptions): Promise<void>;
}

export interface SetupTransitionOptions<T> extends TransitionOptionEventHandlers {
  ref?: ElementRef | ComponentRef<ComponentFactory>;
  refs?: T;
  timelineVars?: () => gsap.TimelineVars;
  setupTransitionInTimeline?: (timeline: gsap.core.Timeline, refs: T) => void;
  setupTransitionOutTimeline?: (timeline: gsap.core.Timeline, refs: T) => void;
}

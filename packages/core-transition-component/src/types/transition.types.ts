import type { AbstractTransitionContext } from '../context/AbstractTransitionContext';

export type GuardFunction = (release: () => void) => void;

export type TimelineOptions = {
  direction: TransitionDirection;
  reset?: boolean;
  timeline?: gsap.core.Timeline;
};

export type TransitionOptions = {
  direction: TransitionDirection;
  scrollTrigger?: gsap.plugins.ScrollTriggerInstanceVars;
  reset?: boolean;
  onStart?: (direction: TransitionDirection) => void;
  onComplete?: (direction: TransitionDirection) => void;
  onUpdate?: (timeline: gsap.core.Timeline) => void;
};

export type TransitionInOptions = Omit<TransitionOptions, 'direction'>;
export type TransitionOutOptions = Omit<TransitionOptions, 'direction'>;

export type TransitionDirection = 'in' | 'out';
export type TransitionController = {
  transitionTimeline: Record<TransitionDirection, gsap.core.Timeline>;
  getTimeline(direction?: TransitionDirection): gsap.core.Timeline;
  resetTimeline(direction?: TransitionDirection): gsap.core.Timeline;
  setupTimeline(options?: Partial<TimelineOptions>): gsap.core.Timeline;
  transition(options: TransitionOptions): Promise<void>;
  transitionIn(options?: TransitionInOptions): Promise<void>;
  transitionOut(options?: TransitionOutOptions): Promise<void>;
};

export type TransitionRef = unknown;

export type SignatureRefElement = HTMLElement | undefined;
export type SignatureRefCollection = Array<HTMLElement>;
export type SignatureElement = SignatureRefCollection | SignatureRefElement;

export type SetupSignatureElements<T extends Record<string, TransitionRef>> = {
  [K in keyof T]: SignatureElement;
} & {
  container: HTMLElement;
};

export type SetupTransitionSignature<
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends Record<string, R> = {},
  R extends TransitionRef = TransitionRef,
  E extends SetupSignatureElements<T> = SetupSignatureElements<T>
> = (
  timeline: gsap.core.Timeline,
  elements: E,
  transitionContext: AbstractTransitionContext<R>,
) => void;

export type SetupTransitionOptions<
  T extends Record<string, R>,
  R extends TransitionRef = TransitionRef,
  E extends SetupSignatureElements<T> = SetupSignatureElements<T>
> = {
  refs?: T;
  scrollTrigger?: gsap.plugins.ScrollTriggerInstanceVars;
  registerTransitionController?: boolean;
  setupTransitionInTimeline?: SetupTransitionSignature<T, R, E>;
  setupTransitionOutTimeline?: SetupTransitionSignature<T, R, E>;
  preferReduceMotion?: boolean;
} & Omit<TransitionOptions, 'direction'>;

export type SetupPageTransitionOptions<
  T extends Record<string, R>,
  R extends TransitionRef = TransitionRef,
  E extends SetupSignatureElements<T> = SetupSignatureElements<T>
> = {
  beforeTransitionIn?: GuardFunction;
  beforeTransitionOut?: GuardFunction;
} & SetupTransitionOptions<T, R, E>;

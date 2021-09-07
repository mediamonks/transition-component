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
  ref?: unknown;
  transitionTimeline: Record<TransitionDirection, gsap.core.Timeline>;
  getTimeline(direction?: TransitionDirection): gsap.core.Timeline;
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

export type SetupTransitionSignature = (timeline: gsap.core.Timeline) => void;

export type SetupTransitionOptions<T = unknown | undefined> = {
  ref?: T;
  scrollTrigger?: gsap.plugins.ScrollTriggerInstanceVars;
  setupTransitionInTimeline?: SetupTransitionSignature;
  setupTransitionOutTimeline?: SetupTransitionSignature;
} & Omit<TransitionOptions, 'direction'>;

export type SetupPageTransitionOptions = {
  beforeTransitionIn?: GuardFunction;
  beforeTransitionOut?: GuardFunction;
} & SetupTransitionOptions;

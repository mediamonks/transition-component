// Hooks
export { useEnterTransition } from './hooks/useEnterTransition';
export { useScrollTransition } from './hooks/useScrollTransition';
export { useTransitionController } from './hooks/useTransitionController';

// Context
export {
  ScrollContext,
  provideScrollContext,
  useScrollContext,
} from './context/ScrollTriggerContext';
export { TRANSITION_CONTROLLERS, findTransitionController } from './context/TransitionControllers';

// Utils
export { addLeaveViewportObserver } from './utils/scroll.utils';
export { cloneTimeline, clearTimeline } from './utils/timeline.utils';
export { unwrapRef, unwrapRefs } from './utils/ref.utils';

// Types
export type {
  TransitionController,
  TransitionDirection,
  TransitionOptions,
  TransitionOptionEventHandlers,
  SetupTimelineOptions,
  SetupTransitionOptions,
} from './types/transition.types';

// Hooks
export { useEnterTransition } from './hooks/useEnterTransition';
export { useScrollTransition } from './hooks/useScrollTransition';
export { useTransitionController } from './hooks/useTransitionController';

// Context
export { setDefaultScrollTriggerVariables } from './context/defaultScrollTriggerVariables';

// Utils
export { transitionRefToElement } from './util/transitionRefToElement';

// Types
export type {
  TransitionController,
  TransitionDirection,
  TransitionOptions,
  TransitionOptionEventHandlers,
  SetupTimelineOptions,
  SetupTransitionOptions,
} from '@mediamonks/core-transition-component';

export {
  TRANSITION_CONTROLLERS,
  findTransitionController,
} from '@mediamonks/core-transition-component';

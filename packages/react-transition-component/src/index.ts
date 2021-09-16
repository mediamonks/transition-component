// Components
export { TransitionPresence } from './components/TransitionPresence';

// Hooks
export { useEnterTransition } from './hooks/useEnterTransition';
export { useLeaveTransition } from './hooks/useLeaveTransition';
export { useRouteLeaveTransition } from './hooks/useRouteLeaveTransition';
export { useSyncRef } from './hooks/useSyncRef';
export { useTransitionController } from './hooks/useTransitionController';

// Lib
export { createTransitionHistory } from './lib/createTransitionHistory';
export { normalizeRefs } from './lib/normalizeRefs';

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

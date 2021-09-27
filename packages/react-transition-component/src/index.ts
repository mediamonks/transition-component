// Components
export { TransitionPresence } from './components/TransitionPresence';
export { TransitionRoute } from './components/TransitionRoute';
export type { TransitionRouteProps } from './components/TransitionRoute';
export { TransitionRouter } from './components/TransitionRouter';
export type { TransitionRouterProps } from './components/TransitionRouter';

// Hooks
export { useEnterTransition } from './hooks/useEnterTransition';
export { useLeaveTransition } from './hooks/useLeaveTransition';
export { useRouteLeaveTransition } from './hooks/useRouteLeaveTransition';
export { useSyncRef } from './hooks/useSyncRef';
export { useTransitionController } from './hooks/useTransitionController';

// Lib
export { unwrapRefs } from './lib/unwrapRefs';

export {
  findTransitionController,
  TRANSITION_CONTROLLERS,
} from '@mediamonks/core-transition-component';
export type {
  SetupTimelineOptions,
  SetupTransitionOptions,
  TransitionController,
  TransitionDirection,
  TransitionOptionEventHandlers,
  TransitionOptions,
} from '@mediamonks/core-transition-component';

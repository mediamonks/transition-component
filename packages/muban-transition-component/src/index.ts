// Re-exports
export {
  clearTimeline,
  cloneTimeline,
  getTransitionController,
  guard,
  TRANSITION_CONTROLLER_CONTEXT,
} from '@mediamonks/core-transition-component';
export type {
  AbstractFlowContext,
  AbstractTransitionContext,
  GuardFunction,
  SetupPageTransitionOptions,
  SetupTransitionOptions,
  SetupTransitionSignature,
  SignatureElement,
  SignatureRefCollection,
  SignatureRefElement,
  TimelineOptions,
  TransitionController,
  TransitionControllerContext,
  TransitionDirection,
  TransitionInOptions,
  TransitionOptions,
  TransitionOutOptions,
} from '@mediamonks/core-transition-component';

// Context
export type { FlowContext } from './context/FlowContext';
export { defaultScrollTriggerVariables } from './context/ScrollContext';
export type { ScrollContext } from './context/ScrollContext';
export type { TransitionContext } from './context/TransitionContext';

// Hooks
export {
  provideTransitionContext,
  useGlobalTransitionContext,
  useTransitionContext,
} from './hooks/useGlobalTransitionContext';
export { usePageTransition } from './hooks/usePageTransition';
export {
  provideFlowContext,
  useFlowContext,
  usePageTransitioning,
} from './hooks/usePageTransitioning';
export {
  provideScrollContext,
  useScrollContext,
  useScrollTransition,
} from './hooks/useScrollTransition';
export { useTransitionController } from './hooks/useTransitionController';

// Types
export type {
  SetupSignatureElements,
  TransitionRef,
  TransitionRefCollection,
  TransitionRefElement,
} from './types/transition.types';
// Utils
export { transitionRefToElement } from './util/transition.utils';

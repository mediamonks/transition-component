import type { TransitionController } from '@mediamonks/core-transition-component';
import { TRANSITION_CONTROLLER_CONTEXT } from '@mediamonks/core-transition-component';
import { useRef } from 'react';

type UseTransitionControllerRef = () => {
  transitionController?: TransitionController;
  ref: unknown;
};

/**
 * "primitive" type for transition controller reference
 */
export type TransitionControllerRef = 'TransitionControllerRef' & {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __brand: symbol;
};

/**
 * Hook to get transition controller using reference
 */
export const useTransitionControllerRef: UseTransitionControllerRef = () => {
  const ref = useRef((Symbol('TransitionControllerRef') as unknown) as TransitionControllerRef);

  return {
    // TODO: Check if this hook is running again after timeline is added to the
    // TransitionContext, if it doesn't this will stay empty
    transitionController: TRANSITION_CONTROLLER_CONTEXT.findTransitionController(ref),
    ref,
  } as const;
};

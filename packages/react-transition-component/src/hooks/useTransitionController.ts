import type {
  SetupTransitionOptions,
  TransitionController,
} from '@mediamonks/core-transition-component';
import {
  getTransitionController,
  TRANSITION_CONTROLLER_CONTEXT,
} from '@mediamonks/core-transition-component';
import { useEffect, useMemo } from 'react';
import { createConnectToTransitionControllerContext } from './useTransitionController.util';

const useConnectToGlobalTransitionControllerContext = createConnectToTransitionControllerContext(
  () => TRANSITION_CONTROLLER_CONTEXT,
);

/**
 * "primitive" type for transition controller reference
 */
export type TransitionControllerRef = 'TransitionControllerRef' & {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __brand: symbol;
};

/**
 * Creates transition controller for React component
 *
 * @param options
 * @param deps
 * @returns
 */
export const useTransitionController = (
  options: () => SetupTransitionOptions<TransitionControllerRef>,
  deps: ReadonlyArray<unknown>,
): TransitionController => {
  const controller = useMemo(() => getTransitionController(options()), deps);

  useEffect(() => {
    controller.setupTimeline({
      direction: 'out',
    });

    controller.setupTimeline({
      direction: 'in',
    });
  }, [controller]);

  useConnectToGlobalTransitionControllerContext(controller);

  return controller;
};

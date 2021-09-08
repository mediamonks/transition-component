import type {
  SetupTransitionOptions,
  TransitionController,
} from '@mediamonks/core-transition-component';
import { getTransitionController } from '@mediamonks/core-transition-component';
import { useEffect, useMemo } from 'react';
import {
  useConnectTransitionControllerContext,
  useConnectTransitionPersistanceContext,
  useConnectTransitionRouterContext,
} from './useTransitionContext';

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

    controller.transitionIn();
  }, [controller]);

  /**
   * Connect controller to controller contexts
   */
  useConnectTransitionControllerContext(controller);
  useConnectTransitionRouterContext(controller);
  useConnectTransitionPersistanceContext(controller);

  return controller;
};

import type {
  SetupTransitionOptions,
  TransitionController,
} from '@mediamonks/core-transition-component';
import { getTransitionController } from '@mediamonks/core-transition-component';
import { useMemo } from 'react';
import type { TransitionControllerRef } from '..';
import {
  useConnectTransitionControllerContext,
  useConnectTransitionPersistanceContext,
  useConnectTransitionRouterContext,
} from './useTransitionContext';

/**
 * Creates transition controller for React component
 *
 * @param options
 * @param deps
 * @returns
 */
export const useTransitionController = (
  options: SetupTransitionOptions<TransitionControllerRef>,
  deps: ReadonlyArray<unknown>,
): TransitionController => {
  const controller = useMemo(() => getTransitionController(options), deps);

  /**
   * Connect controller to controller contexts
   */
  useConnectTransitionControllerContext(controller);
  useConnectTransitionRouterContext(controller);
  useConnectTransitionPersistanceContext(controller);

  return controller;
};

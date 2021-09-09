import { TransitionControllerContext } from '@mediamonks/core-transition-component';
import { useEffect } from 'react';
import { useTransitionController } from './useTransitionController';
import { createConnectToTransitionControllerContext } from './useTransitionController.util';

export const ROUTE_TRANSITION_CONTROLLER_CONTEXT = new TransitionControllerContext();

const useConnectToRouteTransitionControllerContext = createConnectToTransitionControllerContext(
  () => ROUTE_TRANSITION_CONTROLLER_CONTEXT,
);

/**
 * Registers transition controller that starts transition on route mount/unmount
 * TODO: Find solution for nested routes
 *
 * @param args
 * @returns
 */
export const useRouteTransitionController: typeof useTransitionController = (...args) => {
  const controller = useTransitionController(...args);

  useConnectToRouteTransitionControllerContext(controller);

  useEffect(() => {
    controller.transitionIn();
  }, [controller]);

  return controller;
};

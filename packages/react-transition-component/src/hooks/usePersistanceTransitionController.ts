import { TransitionControllerContext } from '@mediamonks/core-transition-component';
import { useEffect } from 'react';
import { usePersistenceTransitionControllerContext } from '../components/PersistenceTransition.context';
import { useTransitionController } from './useTransitionController';
import { createConnectToTransitionControllerContext } from './useTransitionController.util';

export const PERSISTANCE_TRANSITION_CONTROLLER_CONTEXT = new TransitionControllerContext();

const useConnectToPersistanceTransitionControllerContext = createConnectToTransitionControllerContext(
  usePersistenceTransitionControllerContext,
);

/**
 * Registers transition controller that starts transition when component
 * is mounted/unmounted
 *
 * @param args
 * @returns
 */
export const usePersistanceTransitionController: typeof useTransitionController = (...args) => {
  const controller = useTransitionController(...args);

  useConnectToPersistanceTransitionControllerContext(controller);

  useEffect(() => {
    controller.transitionIn();
  }, [controller]);

  return controller;
};

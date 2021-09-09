import type {
  TransitionController,
  TransitionControllerContext,
} from '@mediamonks/core-transition-component';
import { useEffect } from 'react';

/**
 * Creates function to connect transition controller to given transition controller context
 *
 * @param useTransitionControllerContext
 * @param controller
 */
export const createConnectToTransitionControllerContext = (
  getTransitionControllerContext: () => TransitionControllerContext | undefined,
) => (transitionController: TransitionController): void => {
  const transitionControllerContext = getTransitionControllerContext();

  if (transitionControllerContext == null) {
    throw new Error('Cannot find TransitionControllerContext');
  }

  useEffect(() => {
    transitionControllerContext.addTransitionController(transitionController);

    return () => {
      transitionControllerContext.deleteTransitionController(transitionController);
    };
  }, [transitionControllerContext, transitionController]);
};

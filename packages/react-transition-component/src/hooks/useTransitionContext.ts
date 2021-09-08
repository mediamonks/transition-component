import type {
  TransitionControllerContext,
  TransitionController,
} from '@mediamonks/core-transition-component';
import { TRANSITION_CONTROLLER_CONTEXT } from '@mediamonks/core-transition-component';
import { useEffect } from 'react';
import { useTransitionPersistenceContext } from '../components/TransitionPersistence.context';
import { useTransitionRouterContext } from '../components/TransitionRouter.context';

/**
 * Creates function to connect transition controller to given transition controller context
 *
 * @param useTransitionControllerContext
 * @param controller
 */
export const createConnectTransitionControllerContext = (
  useTransitionControllerContext: () => TransitionControllerContext | undefined,
) => (transitionController: TransitionController): void => {
  const controllerContext = useTransitionControllerContext();

  useEffect(() => {
    /**
     * Context for TransitionPersistent and TransitionRouter can be empty,
     * we do nothing in that case.
     */
    if (controllerContext == null) {
      return;
    }

    controllerContext.addTransitionController(transitionController);

    // eslint-disable-next-line consistent-return
    return () => {
      controllerContext.deleteTransitionController(transitionController);
    };
  }, [controllerContext, transitionController]);
};

/**
 * Connects transition controllers to the nearest TransitionPersistent context
 * so that transition out happens on conditional rendering
 */
export const useConnectTransitionPersistanceContext = createConnectTransitionControllerContext(
  useTransitionPersistenceContext,
);

/**
 * Connects transition controllers to the nearest TransitionRouter context
 * so that transition out happens before route change
 */
export const useConnectTransitionRouterContext = createConnectTransitionControllerContext(
  useTransitionRouterContext,
);

/**
 * Connects transition controllers to the global transition context
 */
export const useConnectTransitionControllerContext = createConnectTransitionControllerContext(
  () => TRANSITION_CONTROLLER_CONTEXT,
);

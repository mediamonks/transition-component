import { createTransitionController } from '../utils/transition.utils';
import {
  clearTransitionControllers,
  findTransitionController,
  registerTransitionController,
  TRANSITION_CONTROLLERS,
  unregisterTransitionController,
} from './TransitionControllers';

describe('TransitionControllers', () => {
  const transitionControllerRef = Symbol('transitionControllerRef');

  const transitionController = createTransitionController({
    ref: transitionControllerRef,
  });

  afterEach(() => {
    clearTransitionControllers();
  });

  describe('registerTransitionController', () => {
    it('Should register TransitionController in global TransitionController set', () => {
      registerTransitionController(transitionController);

      expect(TRANSITION_CONTROLLERS.size).toEqual(1);
    });

    it('Should throw when adding already registered TransitionController set', () => {
      registerTransitionController(transitionController);

      expect(() => registerTransitionController(transitionController)).toThrow();
    });
  });

  describe('unregisterTransitionController', () => {
    it('Should unregister TransitionController in global TransitionController set', () => {
      registerTransitionController(transitionController);
      unregisterTransitionController(transitionController);

      expect(TRANSITION_CONTROLLERS.size).toEqual(0);
    });

    it('Should throw when un-registering TransitionController that is not registered', () => {
      expect(() => unregisterTransitionController(transitionController)).toThrow();
    });
  });

  describe('findTransitionController', () => {
    it('Should return TransitionController when TransitionController with ref is registred', () => {
      registerTransitionController(transitionController);

      expect(findTransitionController(transitionController.ref)).toEqual(transitionController);
    });

    it('Should return undefined when TransitionController is not registered', () => {
      expect(findTransitionController(transitionController.ref)).toBeUndefined();
    });
  });
});

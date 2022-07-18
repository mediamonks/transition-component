import { onMounted, onUnmounted } from '@muban/muban';
import { createTransitionController } from '../utils/transition.utils';
import {
  registerTransitionController,
  unregisterTransitionController,
} from '../context/TransitionControllers';
import type { SetupTransitionOptions, TransitionController } from '../types/transition.types';

/**
 * The core hook that can be used to create a transition timeline for a component, it returns a Ref that should be bound
 * to the element that represents the component.
 *
 * @param container
 * @param setupOptions
 */
export function useTransitionController<T>(
  setupOptions: SetupTransitionOptions<T>,
): TransitionController {
  const controller = createTransitionController(setupOptions);

  registerTransitionController(controller);

  // Make sure the in-direction is setup by default
  onMounted(() =>
    controller.setupTimeline({
      direction: 'in',
    }),
  );

  onUnmounted(() => {
    controller.getTimeline('in')?.kill();
    controller.getTimeline('out')?.kill();

    unregisterTransitionController(controller);
  });

  return controller;
}

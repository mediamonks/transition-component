import type {
  SetupTransitionOptions,
  TransitionController,
} from '@mediamonks/core-transition-component';
import { getTransitionController } from '@mediamonks/core-transition-component';
import { onMounted, onUnmounted } from '@muban/muban';
import type { TransitionRefElement } from '../types/transition.types';
import { useTransitionContext } from './useGlobalTransitionContext';

/**
 * The core hook that can be used to create a transition timeline for a component, it returns a Ref that should be bound
 * to the element that represents the component.
 *
 * @param container
 * @param setupOptions
 */
export function useTransitionController(
  container: TransitionRefElement,
  setupOptions: SetupTransitionOptions = {},
): TransitionController | null {
  const transitionContext = useTransitionContext();

  const controller = getTransitionController({
    ref: container,
    ...setupOptions,
  });

  // Make sure the in-direction is setup by default
  onMounted(() =>
    controller.setupTimeline({
      direction: 'in',
    }),
  );

  onUnmounted(() => {
    controller.transitionTimeline.in.kill();
    controller.transitionTimeline.out.kill();
    transitionContext?.unregister(container);
  });

  return controller;
}

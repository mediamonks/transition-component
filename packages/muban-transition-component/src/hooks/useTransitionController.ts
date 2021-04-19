import { onMounted, onUnmounted } from '@muban/muban';
import type {
  SetupTransitionOptions,
  TransitionController,
} from '@mediamonks/core-transition-component';
import { getTransitionController } from '@mediamonks/core-transition-component';
import { useTransitionContext } from './useGlobalTransitionContext';
import type {
  SetupSignatureElements,
  TransitionRef,
  TransitionRefElement,
} from '../types/Transition.types';
import { transitionRefToElement } from '../util/Transition.utils';

/**
 * The core hook that can be used to create a transition timeline for a component, it returns a Ref that should be bound
 * to the element that represents the component.
 *
 * @param container
 * @param setupOptions
 */
export function useTransitionController<
  T extends Record<string, R>,
  R extends TransitionRef = TransitionRef,
  E extends SetupSignatureElements<T> = SetupSignatureElements<T>
>(
  container: TransitionRefElement,
  setupOptions: SetupTransitionOptions<T, R, E> = {},
): TransitionController {
  const transitionContext = useTransitionContext();

  const controller = getTransitionController<T, R, E>(
    container as never,
    setupOptions,
    // TODO: we should not use any here!
    (ref) => transitionRefToElement(ref as never),
    transitionContext as never,
  );

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

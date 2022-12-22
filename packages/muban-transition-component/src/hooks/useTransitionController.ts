/* eslint-disable unicorn/prevent-abbreviations */
import type {
  SetupTransitionOptions,
  TransitionController,
} from '@mediamonks/core-transition-component';
import { getTransitionController } from '@mediamonks/core-transition-component';
import { onMounted, onUnmounted } from '@muban/muban';
import type {
  SetupSignatureElements,
  TransitionRef,
  TransitionRefElement,
} from '../types/transition.types';
import { transitionRefToElement } from '../util/transitionRefToElement';
import { useTransitionContext } from './useGlobalTransitionContext';

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
  E extends SetupSignatureElements<T> = SetupSignatureElements<T>,
>(
  container: TransitionRefElement,
  setupOptions: SetupTransitionOptions<T, R, E> = {},
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
): TransitionController | null {
  const transitionContext = useTransitionContext();

  const controller = getTransitionController<T, R, E>(
    container as never,
    setupOptions,
    (ref) => transitionRefToElement(ref as never),
    transitionContext as never,
  );

  // Make sure the in-direction is setup by default
  onMounted(() =>
    controller?.setupTimeline({
      direction: 'in',
    }),
  );

  onUnmounted(() => {
    controller?.transitionTimeline.in.kill();
    controller?.transitionTimeline.out.kill();
    transitionContext?.unregister(container);
  });

  return controller;
}

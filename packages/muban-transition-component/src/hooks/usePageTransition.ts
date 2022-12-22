/* eslint-disable unicorn/prevent-abbreviations */
import type { SetupPageTransitionOptions } from '@mediamonks/core-transition-component';
import { guard } from '@mediamonks/core-transition-component';
import { onMounted } from '@muban/muban';
import type {
  SetupSignatureElements,
  TransitionRef,
  TransitionRefElement,
} from '../types/transition.types';
import { useTransitionController } from './useTransitionController';

export function usePageTransition<
  T extends Record<string, R>,
  R extends TransitionRef = TransitionRef,
  E extends SetupSignatureElements<T> = SetupSignatureElements<T>,
>(
  ref: TransitionRefElement,
  options: SetupPageTransitionOptions<T, R, E>,
): ReturnType<typeof useTransitionController> {
  const transitionController = useTransitionController(ref, options);
  // const flowContext = useFlowContext();

  onMounted(() => {
    guard(() => transitionController?.transitionIn(), options.beforeTransitionIn);
  });

  // TODO: re-implement when we have some sort of router?
  // onBeforeRouteLeave((to, from, next) =>
  //   Guard(
  //     () => flowContext?.start(element, to, from, next),
  //     options.beforeTransitionOut
  //   )
  // );

  return transitionController;
}

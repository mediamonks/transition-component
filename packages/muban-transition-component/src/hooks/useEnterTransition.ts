import type { TransitionController } from '@mediamonks/core-transition-component';
import { onMounted } from '@muban/muban';
import type { useTransitionController } from './useTransitionController';

export function useEnterTransition(
  transitionController: TransitionController,
): ReturnType<typeof useTransitionController> {
  onMounted(() => {
    transitionController?.transitionIn();
  });

  return transitionController;
}

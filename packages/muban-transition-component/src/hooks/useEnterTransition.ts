import { onMounted } from '@muban/muban';
import type { useTransitionController } from './useTransitionController';
import type { TransitionController } from '../types/transition.types';

export function useEnterTransition(
  transitionController: TransitionController,
): ReturnType<typeof useTransitionController> {
  onMounted(() => {
    transitionController?.transitionIn();
  });

  return transitionController;
}

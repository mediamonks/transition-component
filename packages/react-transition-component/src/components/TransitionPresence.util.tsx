import type { TransitionController } from '@mediamonks/core-transition-component';

export function killTransitionControllerTimelines(
  transitionControllers: Set<TransitionController>,
): void {
  transitionControllers.forEach((transitionController) => {
    transitionController.transitionTimeline.in.kill();
    transitionController.transitionTimeline.out.kill();
  });
}

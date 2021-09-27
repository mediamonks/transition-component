import type { TransitionController } from '@mediamonks/core-transition-component';

export function killTransitionControllersTimelines(
  transitionControllers: Set<TransitionController>,
): void {
  transitionControllers.forEach((transitionController) => {
    transitionController.transitionTimeline.in.kill();
    transitionController.transitionTimeline.out.kill();
  });
}

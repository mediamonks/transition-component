import type { TransitionController } from '@mediamonks/core-transition-component';

export async function transitionOutTransitionControllers(
  transitionControllers: Set<TransitionController>,
): Promise<void> {
  const timelines = Array.from(transitionControllers).map((leaveTransitionController) =>
    leaveTransitionController.transitionOut(),
  );

  await Promise.all(timelines);
}

import type {
  SetupTransitionOptions,
  TransitionController,
} from '@mediamonks/core-transition-component';
import {
  createTransitionController,
  registerTransitionController,
  unregisterTransitionController,
} from '@mediamonks/core-transition-component';
import { useLayoutEffect, useMemo } from 'react';

export function useTransitionController<T>(
  setupOptions: () => SetupTransitionOptions<T>,
  dependencies?: ReadonlyArray<unknown>,
): TransitionController {
  const controller = useMemo(() => createTransitionController(setupOptions()), dependencies ?? []);

  useLayoutEffect(() => {
    registerTransitionController(controller);

    // Make sure the in-direction is setup by default
    controller?.setupTimeline({
      direction: 'in',
    });

    return () => {
      controller?.transitionTimeline.in.kill();
      controller?.transitionTimeline.out.kill();

      unregisterTransitionController(controller);
    };
  }, [controller]);

  return controller;
}

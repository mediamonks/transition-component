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

    return () => {
      controller.getTimeline('in')?.kill();
      controller.getTimeline('out')?.kill();

      unregisterTransitionController(controller);
    };
  }, [controller]);

  return controller;
}

import type { History } from 'history';
import { ROUTE_LEAVE_TRANSITION_CONTROLLERS } from '../hooks/useRouteLeaveTransition';

async function beforePopState(): Promise<void> {
  const timelines = Array.from(ROUTE_LEAVE_TRANSITION_CONTROLLERS).map((transitionController) =>
    transitionController.transitionOut(),
  );

  await Promise.all(timelines);
}

type TargetFunction =
  | History['push']
  | History['replace']
  | History['go']
  | History['goForward']
  | History['goBack'];

const decorateHistoryFunction =
  <T extends TargetFunction, P extends Parameters<T>>(
    targetFunction: T,
    guard: (...parameters: P) => boolean = () => true,
  ) =>
  async (...parameters: P) => {
    if (guard(...parameters)) {
      await beforePopState();
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    targetFunction(...parameters);
  };

/**
 * Decorates History instance to make it work with transition hooks
 *
 * @param history
 * @returns
 */
export function createTransitionHistory<T = unknown>(history: History<T>): History<T> {
  const newHistory = {
    ...history,
    replace: decorateHistoryFunction(history.replace, (path) => path !== history.location.pathname),
    push: decorateHistoryFunction(history.push, (path) => path !== history.location.pathname),
    go: decorateHistoryFunction(history.go, (n) => n !== 0),
    goForward: decorateHistoryFunction(history.goForward),
    goBack: decorateHistoryFunction(history.goBack),
  };

  return newHistory;
}

import type { History } from 'history';
import type { TransitionRouterContext } from './TransitionRouter.context';

type TargetFunctions = History['push'] | History['replace'] | History['go'];

export const createTransitionHistory = (
  history: History,
  transitionRouterContext: TransitionRouterContext,
): History => {
  const createProxy = <T extends TargetFunctions>(targetFunction: T): T =>
    new Proxy(targetFunction, {
      async apply(target, thisArgument, argumentList) {
        await transitionRouterContext.transition({
          direction: 'out',
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        target(...argumentList);
      },
    });

  const newHistory = {
    ...history,
    push: createProxy(history.push),
    replace: createProxy(history.replace),
    go: createProxy(history.go),
  };

  return newHistory;
};

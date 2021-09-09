import type { History } from 'history';
import { ROUTE_TRANSITION_CONTROLLER_CONTEXT } from '../hooks/useRouteTransitionController';

type TargetFunctions = History['push'] | History['replace'] | History['go'];

export const createTransitionHistory = (history: History): History => {
  const createProxy = <T extends TargetFunctions>(targetFunction: T): T =>
    new Proxy(targetFunction, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      async apply(target, _thisArgument, argumentList) {
        await ROUTE_TRANSITION_CONTROLLER_CONTEXT.transition({
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

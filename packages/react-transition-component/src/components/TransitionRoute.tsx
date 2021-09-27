import type { TransitionController } from '@mediamonks/core-transition-component';
import type { ReactElement } from 'react';
import React, { useContext, useLayoutEffect, useMemo, useState } from 'react';
import type {
  ExtractRouteParams,
  match as MatchType,
  RouteComponentProps,
  RouteProps,
} from 'react-router';
import { matchPath, __RouterContext } from 'react-router';
import { createTransitionControllerContext } from '../context/TransitionControllersContext';
import { noop } from '../lib/noop';
import { transitionOutTransitionControllers } from '../lib/transitionOutTransitionControllers';
import { useTransitionRouterContext } from './TransitionRouter';

const useRouterContext = () => useContext(__RouterContext);

const { TransitionControllersContext, useTransitionControllers } =
  createTransitionControllerContext();

export const useTransitionRouteTransitionControllers = useTransitionControllers;

export interface TransitionRouteProps<
  Path extends string = string,
  Params extends { [K: string]: string | undefined } = ExtractRouteParams<Path, string>,
> extends Omit<RouteProps<Path, Params>, 'render' | 'component' | 'children'> {
  /**
   * Match as computed by Switch component
   * @private
   */
  computedMatch?: MatchType<Params>;

  /**
   * Enables cross flow for this route (don't wait for transitionOut of other routes)
   */
  crossFlow?: boolean;

  /**
   * Only allow function as children
   */
  children: (props: RouteComponentProps) => React.ReactNode;
}

/**
 * @example
 * function MyComponent() {
 *   const transitionController = useTransitionController(...);
 *
 *   // Attach transitionController to route leave lifecycle
 *   useRouteLeaveTransition(transitionController);
 *
 *   return <div>MyComponent</div>
 * }
 *
 * <TransitionRouter history={browserHistory}>
 *   <TransitionRoute path="/">
 *     <MyComponent />
 *   </TransitionRoute>
 *   <TransitionRoute path="/about">
 *     <MyComponent />
 *   </TransitionRoute>
 *   <TransitionRoute path="/examples" crossFlow>
 *     <MyComponent />
 *   </TransitionRoute>
 * </TransitionRouter>
 */
export function TransitionRoute(props: TransitionRouteProps): ReactElement | null {
  const transitionRouterContext = useTransitionRouterContext();
  const context = useRouterContext();

  if (transitionRouterContext == null) {
    throw new Error('<TransitionRoute /> must be child of <TransitionRouter />');
  }

  const match = useMemo(
    () => (props.path ? matchPath(context.location.pathname, props) : null),
    [context.location.pathname, ...Object.values(props)],
  );

  const [delayedMatch, setDelayedMatch] = useState(match);

  /**
   * Set of TransitionControllers that is used to transitionOut this Route's children
   */
  const transitionControllers = useMemo(() => new Set<TransitionController>(), []);

  useLayoutEffect(() => {
    if (delayedMatch === match) {
      return noop;
    }

    // Immediately set new children on match when cross flow is enabled
    if (props.crossFlow && match) {
      setDelayedMatch(match);
      return noop;
    }

    // Hook can be re-invoked when awaiting promises so we must be able to abort the hook
    let aborted = false;

    (async () => {
      if (!match) {
        /**
         * Start transitionOut of TransitionControllers in children of this Route
         */
        const transitionOutPromise = transitionOutTransitionControllers(transitionControllers);

        // Register out transition so that any routes that should transition in can wait for the out transition
        transitionRouterContext.registerTransitionOutPromise(transitionOutPromise);

        // Wait for transitionOut before updating match
        await transitionOutPromise;
      } else {
        /**
         * Transition in after all route leave transitions have finish (non-cross flow).
         * Continue the flow at end of call stack to make sure the transitionOut
         * of other routes have started.
         */
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Wait for transition out in children and other routes
        await Promise.all(Array.from(transitionRouterContext.transitionOutPromises));
      }

      // Abort flow when match changes while awaiting promises
      if (aborted) {
        return;
      }

      setDelayedMatch(match);
    })();

    return () => {
      aborted = true;
    };
  }, [match]);

  /**
   * Props and context value
   */
  const value = useMemo<RouteComponentProps>(
    () => ({
      ...context,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      match: delayedMatch!,
    }),
    [context, delayedMatch],
  );

  return (
    <TransitionControllersContext.Provider value={transitionControllers}>
      {value.match ? (
        <__RouterContext.Provider value={value}>{props.children(value)}</__RouterContext.Provider>
      ) : null}
    </TransitionControllersContext.Provider>
  );
}

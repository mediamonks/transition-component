import type { ReactElement, ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { RouterProps } from 'react-router';
import { Router } from 'react-router';

interface TransitionRouterContextType {
  registerTransitionOutPromise: (transitionOutPromise: Promise<unknown>) => void;
  transitionOutPromises: Set<Promise<unknown>>;
}

const TransitionRouterContext = createContext<TransitionRouterContextType | undefined>(undefined);

export function useTransitionRouterContext(): TransitionRouterContextType | undefined {
  return useContext(TransitionRouterContext);
}

export interface TransitionRouterProps extends RouterProps {
  children: ReactNode;
}

export function TransitionRouter(props: TransitionRouterProps): ReactElement {
  const value = useMemo(() => {
    const transitionOutPromises = new Set<Promise<unknown>>();

    return {
      transitionOutPromises,
      registerTransitionOutPromise(transitionOutPromise: Promise<unknown>) {
        transitionOutPromises.add(transitionOutPromise);

        (async () => {
          // Cleanup transitionOutPromise when transition is completed
          await transitionOutPromise;

          transitionOutPromises.delete(transitionOutPromise);
        })();
      },
    } as const;
  }, []);

  return (
    <TransitionRouterContext.Provider value={value}>
      <Router {...props} />
    </TransitionRouterContext.Provider>
  );
}

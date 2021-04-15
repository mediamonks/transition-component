import { createContext } from '@muban/muban';
import { TransitionContext } from '../context/TransitionContext';

export const [provideTransitionContext, useTransitionContext] = createContext<
  TransitionContext | undefined
>('transitionContext');

export function useGlobalTransitionContext(): TransitionContext {
  const parentTransitionContext = useTransitionContext();

  // Create one transition context that is shared in the entire application, this is used to retrieve transition
  // controllers for different components.
  const transitionContext = parentTransitionContext || new TransitionContext();

  // Make sure the transition context is provided so all child components can access it.
  provideTransitionContext(transitionContext);

  return transitionContext;
}

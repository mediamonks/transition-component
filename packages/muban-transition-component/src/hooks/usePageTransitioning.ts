import { createContext } from '@muban/muban';
import { useGlobalTransitionContext } from './useGlobalTransitionContext';
import { FlowContext } from '../context/FlowContext';

export const [provideFlowContext, useFlowContext] = createContext<FlowContext | undefined>(
  'flowContext',
);

// We need to provide the transition context because this hook is set on the same level
export function usePageTransitioning(): ReadonlyArray<
  (element: HTMLElement, done: () => void) => void
> {
  const transitionContext = useGlobalTransitionContext();
  const flowContext = new FlowContext(transitionContext);

  // Make sure the transition context is provided so all child components can access it.
  provideFlowContext(flowContext);

  const onLeave = async (element: HTMLElement, done: () => void) => {
    // Wait for the page's out-flow to be completed.
    await flowContext?.transitionOut;

    // Continue with the flow after the current active page has been transitioned-out.
    done();
  };

  return [onLeave];
}

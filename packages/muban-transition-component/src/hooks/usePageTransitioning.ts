import { createContext } from '@muban/muban';
import { FlowContext } from '../context/FlowContext';
import { useGlobalTransitionContext } from './useGlobalTransitionContext';

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

  async function onLeave(_element: HTMLElement, done: () => void): Promise<void> {
    // Wait for the page's out-flow to be completed.
    await flowContext.transitionOut;

    // Continue with the flow after the current active page has been transitioned-out.
    done();
  }

  return [onLeave];
}

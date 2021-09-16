import {
  useEnterTransition,
  useLeaveTransition,
  useTransitionController,
} from '@mediamonks/react-transition-component';
import { ReactNode, useRef } from 'react';
import {
  setupTransitionInTimeline,
  setupTransitionOutTimeline,
} from './MyTransitionComponent.transitions';

interface MyTransitionComponentProps {
  children: ReactNode;
}

export function MyTransitionComponent({ children }: MyTransitionComponentProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const transitionController = useTransitionController(() => ({
    refs: {
      div: divRef,
    },
    setupTransitionInTimeline,
    setupTransitionOutTimeline,
  }));

  useEnterTransition(transitionController);
  useLeaveTransition(transitionController);

  return (
    <div
      ref={divRef}
      style={{
        width: 200,
        height: 200,
        background: 'red',
        margin: 20,
      }}
    >
      {children}
    </div>
  );
}

import { useEnterTimeline, useLeaveTimeline } from '@mediamonks/react-transition-component';
import { ReactNode, useRef } from 'react';

interface MyTransitionComponentProps {
  children: ReactNode;
}

export function MyTransitionComponent({ children }: MyTransitionComponentProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEnterTimeline((timeline) => {
    timeline
      .set(divRef.current, {
        scale: 0,
      })
      .to(divRef.current, {
        rotation: 45,
        scaleY: 1,
        scaleX: 0.5,
      })
      .to(divRef.current, {
        scale: 1,
        rotation: 0,
      });

    return timeline;
  });

  useLeaveTimeline((timeline) => {
    timeline.to(divRef.current, {
      x: 0,
      scale: 1.5,
      rotation: -270,
      duration: 1,
    });

    return timeline;
  });

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

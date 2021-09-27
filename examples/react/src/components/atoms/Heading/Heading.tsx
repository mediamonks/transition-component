import {
  useSyncRef,
  useTransitionController,
  TransitionController,
} from '@mediamonks/react-transition-component';
import { forwardRef, ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
import { StyledHeading } from './Heading.styles';
import { setupTransitionInTimeline } from './Heading.transitions';

interface HeadingProps {
  as?: any;
  className?: string;
  children: ReactNode;
}

export default forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { children, ...props }: HeadingProps,
  ref,
): ReactElement {
  const mainRef = useRef<HTMLDivElement>(null);

  useTransitionController(() => ({
    refs: {
      mainRef,
    },
    timelineVars: {
      scrollTrigger: {
        trigger: mainRef.current,
        markers: true,
        invalidateOnRefresh: true,
        start: 'top 75%',
        scrub: 0.5,
      },
    },
    setupTransitionInTimeline,
  }));

  return (
    <StyledHeading ref={ref} {...props}>
      <div ref={mainRef}>{children}</div>
    </StyledHeading>
  );
});

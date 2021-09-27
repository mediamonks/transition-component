import {
  useTransitionController,
} from '@mediamonks/react-transition-component';
import { forwardRef, ReactElement, ReactNode, useRef } from 'react';
import { StyledHeading } from './Heading.styles';
import { setupTransitionInTimeline } from './Heading.transitions';
import { HeadingType } from './Heading.data';

interface HeadingProps {
  as?: HeadingType;
  className?: string;
  children: ReactNode;
}

export default forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { children, as = HeadingType.H1, ...props }: HeadingProps,
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
    <StyledHeading ref={ref} $type={as} {...props}>
      <div ref={mainRef}>{children}</div>
    </StyledHeading>
  );
});

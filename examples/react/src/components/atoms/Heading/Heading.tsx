import {
  useSyncRef,
  useTransitionController,
  TransitionController,
} from '@mediamonks/react-transition-component';
import { forwardRef, ReactElement, ReactNode, useEffect, useRef } from 'react';
import { StyledHeading } from './Heading.styles';
import { setupTransitionInTimeline } from './Heading.transitions';

interface HeadingProps {
  className?: string;
  transitionController?: (transitionController: TransitionController) => void;
  children: ReactNode;
}

export default forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { children, transitionController, ...props }: HeadingProps,
  ref,
): ReactElement {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useSyncRef(headingRef, ref);

  const headingTransitionController = useTransitionController(() => ({
    ref: headingRef.current,
    refs: {
      heading: headingRef,
    },
    setupTransitionInTimeline,
  }));

  useEffect(() => {
    if (transitionController == null) {
      return;
    }

    transitionController(headingTransitionController);
  }, [headingTransitionController, transitionController]);

  return (
    <StyledHeading ref={headingRef} {...props}>
      {children}
    </StyledHeading>
  );
});

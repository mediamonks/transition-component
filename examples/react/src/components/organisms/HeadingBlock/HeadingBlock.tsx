import { useTransitionController } from '@mediamonks/react-transition-component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ReactElement } from 'react';
import { useRef } from 'react';
import { SplitText } from '../../../util/SplitText';
import { StyledHeading, StyledHeadingBlock } from './HeadingBlock.styles';
import { setupTransitionInTimeline } from './HeadingBlock.transitions';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface HeadingBlockProps {
  backgroundColor?: string;
  copy?: string;
  className?: string;
}

export default function HeadingBlock({
  copy,
  className,
  backgroundColor,
  ...props
}: HeadingBlockProps): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useTransitionController(() => ({
    timelineVars: {
      scrollTrigger: {
        trigger: divRef.current,
        scrub: false,
        id: 'headingBlock',
        start: '-=300',
        end: '+=250',
        markers: Boolean(process.env.SHOW_MARKERS),
      },
    },
    refs: {
      heading: headingRef,
    },
    setupTransitionInTimeline,
  }));

  return (
    <StyledHeadingBlock
      className={className}
      ref={divRef}
      $backgroundColor={backgroundColor}
      {...props}
    >
      <StyledHeading ref={headingRef}>{copy}</StyledHeading>
    </StyledHeadingBlock>
  );
}

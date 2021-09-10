import { useTimeline } from '@mediamonks/react-transition-component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ReactElement } from 'react';
import { useRef } from 'react';
import { SplitText } from '../../../util/SplitText';
import { StyledHeading, StyledHeadingBlock } from './HeadingBlock.styles';

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

  useTimeline(
    (timeline) => {
      const splitHeading = new SplitText(headingRef.current);

      console.log(splitHeading.chars);

      timeline.fromTo(
        splitHeading.chars,
        {
          yPercent: -200,
          opacity: 0,
          stagger: {
            from: 'start',
            axis: 'x',
            amount: 0.2,
          },
          duration: 0.25,
          ease: 'back',
        },
        {
          yPercent: 0,
          opacity: 1,
        },
      );

      return timeline;
    },
    () => ({
      scrollTrigger: {
        trigger: divRef.current,
        scrub: 1,
        id: 'headingBlock',
        start: '-=300',
        end: '+=250',
        markers: true,
      },
    }),
  );

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

import type { ReactElement, ReactNode } from 'react';
import React, { useRef } from 'react';
import { StyledFullScreenImageBlock } from './FullScreenImageBlock.styles';
import { TransitionControllerRef, useTransitionController } from '@mediamonks/react-transition-component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FullScreenImageBlockProps {
  transitionRef?: TransitionControllerRef;
}

export default function FullScreenImageBlock(
  {transitionRef, ...props}:FullScreenImageBlockProps): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);

  useTransitionController(
    () => ({
      ref: transitionRef,
      setupTransitionInTimeline( ) {
        return gsap.timeline({
          scrollTrigger: {
            scrub: 1,
            trigger: divRef.current as Element,
            start: divRef.current ? Math.max(divRef.current.offsetTop - window.innerHeight, 0) : 0,
            end: `+=${(divRef.current as HTMLElement).offsetHeight + window.innerHeight}`,
            toggleActions: "restart none none reset",
          }
        })
        .fromTo((divRef.current as Element).children[0], {
          yPercent: -10,
          scale: 1.2,
        }, {
          yPercent: 10,
          duration: 1,
          ease: "power1.inOut"
        }, 0);
      },
    }),
    [divRef, transitionRef],
  );

  return (
    <StyledFullScreenImageBlock
      ref={divRef}
      {...props}
    >
      <img alt="random image" src={"https://source.unsplash.com/1600x900/?nature,water"} />
    </StyledFullScreenImageBlock>
  );
};

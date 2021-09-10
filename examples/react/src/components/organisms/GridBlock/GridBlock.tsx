import type { ReactElement } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { StyledBlock, StyledGridBlock } from './GridBlock.styles';
import { TransitionControllerRef, useTransitionController } from '@mediamonks/react-transition-component';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GridBlockProps {
  backgroundColor?: string;
  transitionRef?: TransitionControllerRef;
}

export default function GridBlock(
  {transitionRef, backgroundColor, ...props}:GridBlockProps): ReactElement {
  const divRef = useRef<HTMLDivElement>(null);
  const [blockes, setBlockes] = useState<Array<Element>>([]);

  useEffect(() => {
    if (divRef.current) {
      setBlockes(Array.from(divRef.current.querySelectorAll('[data-block]')))
    }
  }, []);

  useTransitionController(
    () => ({
      ref: transitionRef,
      setupTransitionInTimeline( ) {
        return gsap.timeline({
          scrollTrigger: {
            scrub: 1,
            trigger: divRef.current as Element,
            start: "-=400",
            end: "+=400",
            toggleActions: "restart none none reset"
          }
        })
        .fromTo(divRef.current, {
          opacity: 0,
        }, {
          opacity: 1,
          duration: 1,
        })
          .fromTo(blockes, {
            scale: 0,
          }, {
            scale: 1,
            duration: 0.5,
            ease: "power2.inOut",
            clearProps: 'all',
            stagger: {
              grid: [10,6],
              from: "center",
              amount: 1.5
            }
          }, 0.25)
      },
    }),
    [divRef, transitionRef, blockes],
  );

  return (
    <StyledGridBlock
      ref={divRef}
      $backgroundColor={backgroundColor}
      {...props}
    >
      {Array.from(new Array(120)).map((none, index) => (
        <StyledBlock $backgroundColor={backgroundColor} className={index === 119 ? "last-grid-block" : ""} data-block />
        ))
      }
    </StyledGridBlock>
  );
};

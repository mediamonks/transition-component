/* eslint-disable react/jsx-no-literals, react/no-multi-comp */
import gsap from 'gsap';
import { useRef, type ReactElement } from 'react';
import { useScrollAnimation } from './useScrollAnimation.js';

export default {
  title: 'hooks/useScrollAnimation',
  parameters: {
    layout: 'fullscreen',
  },
};

export function UseScrollAnimation(): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);

  useScrollAnimation(
    () =>
      gsap.to(ref.current, {
        scale: 0.5,
        ease: 'power3.out',
        scrollTrigger: {
          pin: ref.current,
          scrub: true,
          markers: true,
          end: '+=100%',
        },
      }),
    [],
  );

  return (
    <div>
      <div
        ref={ref}
        style={{
          width: '100%',
          height: '50vh',
          margin: '0 auto',
          background: 'purple',
        }}
      />
    </div>
  );
}

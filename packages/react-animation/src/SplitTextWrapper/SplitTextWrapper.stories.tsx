/* eslint-disable react/jsx-no-literals */
import gsap from 'gsap';
import { useCallback, useRef, type ReactElement } from 'react';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { SplitTextWrapper } from './SplitTextWrapper.js';

export default {
  title: 'components/SplitTextWrapper',
};

export function Example(): ReactElement {
  const splitTextRef = useRef<SplitText>(null);

  const animation = useAnimation(() => {
    if (!splitTextRef.current) {
      return;
    }

    return gsap.from(splitTextRef.current.words, {
      y: 20,
      x: 4,
      opacity: 0,
      duration: 0.2,
      stagger: 0.05,
    });
  }, []);

  const onReplay = useCallback(() => {
    animation.current?.play(0);
  }, [animation]);

  return (
    <>
      <h1>
        <SplitTextWrapper ref={splitTextRef}>
          <>
            Lorem ipsum dolor sit <i>amet consectetur</i>
            <br /> adipisicing elit. <b>Tenetur perspiciatis</b> eius ea, ratione,
            <br /> illo molestias, <code>quia sapiente</code> modi quo
            <br /> molestiae temporibus.
          </>
        </SplitTextWrapper>
      </h1>

      <button onClick={onReplay} type="button" style={{ cursor: 'pointer' }}>
        Replay
      </button>
    </>
  );
}

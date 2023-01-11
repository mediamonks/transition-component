/* eslint-disable react/jsx-no-literals, react/no-multi-comp */
import gsap, { Bounce } from 'gsap';
import { useCallback, useRef, type ReactElement } from 'react';
import { useAnimation } from './useAnimation.js';

export default {
  title: 'hooks/useAnimation',
  component: Timeline,
};

export function Timeline(): ReactElement {
  const ref = useRef<HTMLHeadingElement>(null);

  const animation = useAnimation(() => {
    if (ref.current === null) {
      return;
    }

    gsap.set(ref.current, {
      scaleX: 0,
      scaleY: 0,
    });

    return gsap
      .timeline()
      .to(ref.current, {
        scaleX: 0.25,
        scaleY: 0.25,
        ease: 'power3.inOut',
      })
      .to(ref.current, {
        scaleX: 1,
        scaleY: 0.25,
        ease: 'power3.inOut',
      })
      .to(ref.current, {
        scaleX: 0.25,
        scaleY: 1,
        ease: 'power3.inOut',
      })
      .to(ref.current, {
        scaleX: 0.25,
        scaleY: 0.25,
        ease: 'power3.inOut',
      })
      .to(ref.current, {
        scale: 1,
        delay: 0.5,
        ease: Bounce.easeOut,
      });
  }, []);

  const onReplay = useCallback(() => {
    animation.current?.play(0);
  }, [animation]);

  return (
    <>
      <div
        ref={ref}
        style={{
          width: 300,
          height: 300,
          background: 'purple',
        }}
      />

      <br />
      <br />

      <button onClick={onReplay} type="button">
        Replay
      </button>
    </>
  );
}

export function Tween(): ReactElement {
  const ref = useRef<HTMLHeadingElement>(null);

  const animation = useAnimation(() => {
    if (ref.current === null) {
      return;
    }

    return gsap.from(ref.current, {
      scale: 0,
      rotate: 120,
      duration: 0.6,
      ease: 'power3.out',
    });
  }, []);

  const onReplay = useCallback(() => {
    animation.current?.play(0);
  }, [animation]);

  return (
    <>
      <div
        ref={ref}
        style={{
          width: 300,
          height: 300,
          background: 'purple',
        }}
      />

      <br />
      <br />

      <button onClick={onReplay} type="button">
        Replay
      </button>
    </>
  );
}

export function OnAction(): ReactElement {
  const ref = useRef<HTMLHeadingElement>(null);

  const animation = useAnimation(() => {
    if (ref.current === null) {
      return;
    }

    return gsap.from(ref.current, {
      paused: true,
      scale: 0,
      rotate: 120,
      duration: 0.6,
      ease: 'power3.out',
    });
  }, []);

  const onPlay = useCallback(() => {
    if (animation.current?.progress() === 1) {
      animation.current.play(0);
      return;
    }

    animation.current?.play();
  }, [animation]);

  const onPause = useCallback(() => {
    animation.current?.pause();
  }, [animation]);

  const onReset = useCallback(() => {
    animation.current?.pause();
    animation.current?.progress(0);
  }, [animation]);

  return (
    <>
      <div
        ref={ref}
        style={{
          width: 300,
          height: 300,
          background: 'purple',
        }}
      />

      <br />

      <button onClick={onPlay} type="button">
        Play
      </button>

      <button onClick={onPause} type="button">
        Pause
      </button>

      <button onClick={onReset} type="button">
        Reset
      </button>
    </>
  );
}

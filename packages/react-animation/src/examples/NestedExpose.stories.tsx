/* eslint-disable react/jsx-no-literals */
import { arrayRef, ensuredForwardRef, type MutableRefs, useRefs } from '@mediamonks/react-hooks';
import gsap from 'gsap';
import { type ReactElement } from 'react';
import { useAnimation } from '../useAnimation/useAnimation.js';
import { useExposeAnimation } from '../useExposeAnimation/useExposeAnimation.js';
import { useExposedAnimation } from '../useExposedAnimation/useExposedAnimation.js';
import { useExposedAnimations } from '../useExposedAnimations/useExposedAnimations.js';

export default {
  title: 'examples/NestedExpose',
};

// Accordion (exposedAnimations)
// |- Slide (expose, use header exposed animation)
//   |- Header (expose)

type HeaderRefs = MutableRefs<{
  self: HTMLDivElement;
}>;

const Header = ensuredForwardRef<HTMLDivElement>((props, ref) => {
  const refs = useRefs<HeaderRefs>({
    self: ref,
  });
  const animation = useAnimation(
    () => gsap.fromTo(refs.self.current, { opacity: 0, duration: 1 }, { opacity: 1 }),
    [],
  );
  useExposeAnimation(animation, ref);

  return <div ref={refs.self}>Header</div>;
});

type SlideRefs = MutableRefs<{
  self: HTMLDivElement;
  header: HTMLDivElement;
}>;

const Slide = ensuredForwardRef<HTMLDivElement>((props, ref) => {
  const refs = useRefs<SlideRefs>({
    self: ref,
  });
  // if this update, it will rerender
  const headerAnimation = useExposedAnimation(refs.header);

  // this internal useEffect will update the animation within the ref
  const animation = useAnimation(() => {
    if (!headerAnimation) {
      return gsap.timeline();
    }
    const tl = gsap.timeline();
    tl.add(gsap.fromTo(refs.self.current, { opacity: 0, duration: 1 }, { opacity: 1 }));
    tl.add(headerAnimation);
    return tl;
  }, [headerAnimation]);

  // this hook should know when the animation is updated, so it internally relies
  // on animation.current to register the animation in the global Map.
  useExposeAnimation(animation, ref);

  return (
    <div ref={refs.self}>
      <Header ref={refs.header} />
    </div>
  );
});

type CarouselRefs = MutableRefs<{
  self: HTMLDivElement;
  items: Array<HTMLDivElement>;
}>;

export function NestedExpose(): ReactElement {
  const refs = useRefs<CarouselRefs>({});
  const itemsAnimations = useExposedAnimations(refs.items);

  useAnimation(() => {
    const tl = gsap.timeline();
    for (const item of itemsAnimations) {
      tl.add(item, '<0.5');
    }
    return tl;
  }, [itemsAnimations]);

  return (
    <div>
      {Array.from({ length: 5 }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Slide key={index} ref={arrayRef(refs.items, index)} />
      ))}
    </div>
  );
}

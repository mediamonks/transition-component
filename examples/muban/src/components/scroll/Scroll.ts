import { defineComponent, refElement } from '@muban/muban';
import { unwrapRefs, useScrollTransition } from '@mediamonks/muban-transition-component';

export const Scroll = defineComponent({
  name: 'scroll',
  refs: {
    paragraph: refElement<HTMLElement>('paragraph'),
  },
  setup({ refs }) {
    useScrollTransition(refs.self, {
      refs: {
        paragraph: refs.paragraph,
      },
      timelineVars: () => ({
        scrollTrigger: {
          start: 'top 100%', // Make sure the animation is triggered as soon as it enters the viewport
        },
      }),
      setupTransitionInTimeline: (timeline, transitionRefs) => {
        const { paragraph } = unwrapRefs(transitionRefs);

        if (paragraph)
          timeline.from(paragraph, {
            y: 200,
            autoAlpha: 0,
            duration: 1,
            ease: 'expo.out',
          });
      },
    });
    return [];
  },
});

import { type SetupTransitionSignature } from '@mediamonks/core-transition-component';
import { bind, defineComponent, ref, refElement } from '@muban/muban';
import { html } from '@muban/template';
import { type StoryObj, type Meta } from '@storybook/react';
import { layoutDecorator } from '../storybook/Layout';
import { MubanRenderer } from '../storybook/MubanRenderer';
import { type TransitionRefElement } from '../types/transition.types';
import { useTransitionController } from './useTransitionController';

export default {
  title: 'hooks/useTransitionController',
  decorators: [layoutDecorator],
} satisfies Meta;

type TransitionRefs = {
  box: TransitionRefElement;
};

const setupTransitionInTimeline: SetupTransitionSignature<TransitionRefs> = (timeline, { box }) => {
  if (box === undefined) {
    return;
  }

  timeline.to(box, {
    xPercent: 100,
  });
};

const Component = defineComponent({
  name: 'component',
  refs: {
    box: refElement<HTMLDivElement>('box'),
  },
  setup({ refs }) {
    const direction = ref<'in' | 'out'>('in');

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const transitionController = useTransitionController(refs.self, {
      refs: {
        box: refs.box,
      },
      setupTransitionInTimeline,
    });

    return [
      bind(refs.box, {
        click() {
          if (direction.value === 'in') {
            transitionController?.transitionIn();
            direction.value = 'out';
          } else {
            transitionController?.transitionOut();
            direction.value = 'in';
          }
        },
      }),
    ];
  },
});

const markup = html`
  <div data-component="component">
    <div style="inline-size:200px;block-size:200px;background:red;cursor:pointer;" data-ref="box">
      Box
    </div>
  </div>
`;

export const Default: StoryObj = {
  name: 'Default',
  render() {
    return <MubanRenderer component={Component} markup={markup} />;
  },
};

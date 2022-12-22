import { type SetupTransitionSignature } from '@mediamonks/core-transition-component';
import { defineComponent, refElement } from '@muban/muban';
import { html } from '@muban/template';
import { type Meta, type StoryObj } from '@storybook/react';
import { layoutDecorator } from '../storybook/Layout';
import { MubanRenderer } from '../storybook/MubanRenderer';
import { type TransitionRefElement } from '../types/transition.types';
import { usePageTransition } from './usePageTransition';

export default {
  title: 'hooks/usePageTransition',
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePageTransition(refs.self, {
      refs: {
        box: refs.box,
      },
      setupTransitionInTimeline,
    });

    return [];
  },
});

const markup = html`
  <div data-component="component">
    <div style="inline-size: 200px;block-size: 200px;background: red;" data-ref="box">Box</div>
  </div>
`;

export const Default: StoryObj = {
  name: 'Default',
  render() {
    return <MubanRenderer component={Component} markup={markup} />;
  },
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { useCallback, useRef, useState } from 'react';
import type {
  TransitionDirection,
  TransitionController,
} from '@mediamonks/muban-transition-component';
import type { ChangeEvent } from 'react';
import { addons, types } from '@storybook/addons';
import { AddonPanel, Button } from '@storybook/components';
import { STORY_RENDERED } from '@storybook/core-events';
import { styled } from '@storybook/theming';

export const TRANSITION_ELEMENT = 'transitionElement';

const ADDON_ID = 'muban-transition';
const PANEL_ID = `${ADDON_ID}/panel`;

const Paragraph = styled.p(({ theme }) => ({
  fontSize: theme.typography.size.s2,
  fontWeight: theme.typography.weight.bold,
}));

const ControlRow = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginBottom: 10,
  paddingBottom: 10,
  borderBottom: `1px solid ${theme.color.darker}`,
  '> :first-of-type': {
    flexBasis: 200,
  },
}));

const SeekInput = styled.input(() => ({
  flexGrow: 1,
}));

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Transitions',
    render: ({ active, key }) => {
      const transitionController = useRef<null | TransitionController>(null);

      const [seekValue, setSeekValue] = useState<number>(100);
      const [enableControls, setEnableControls] = useState<boolean>(false);
      const [timelineDuration, setTimelineDuration] = useState(0);

      addons.getChannel().once(STORY_RENDERED, (id) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { transitionContext } = window as any;
        // The transition controller is linked to the component element. I couldn't find a way to
        // retrieve this element through the  Storybook API, so in a not so pretty workaround I use
        // the story name to find the component element in the iframe.
        const iframe = document.body.querySelector<HTMLIFrameElement>('#storybook-preview-iframe');
        // All of the stories are grouped in a category (atoms/molecules/organisms/blocks) and have
        // the following naming convention: `[category]-[id]-[name]--[story name]`. This allows us
        // to use a RegEx to retrieve the part between the category and story name.
        // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars
        const [_, componentId] = /-(.*)--/g.exec(id) || [];
        // TODO: we might want to find a better way to retrieve the story element.
        const element = iframe?.contentWindow?.document.body.querySelector<HTMLElement>(
          `[data-component="${componentId}"]`,
        );

        if (element && transitionContext) {
          try {
            const controller = transitionContext.getController(element);
            // Retrieve the timeline duration because we use it for seeking
            const duration = controller.transitionTimeline.in.duration();
            // Make sure the timeline is paused at the end by default, the transition in can be
            // triggered by clicking the play button!
            controller.transitionTimeline.in.pause(duration);
            // Store the reference so we can control it from the UI.
            transitionController.current = controller;
            setEnableControls(true);
            setTimelineDuration(duration);
          } catch (error) {
            setEnableControls(false);
          }
        }
      });

      const onTransition = useCallback(
        (direction: TransitionDirection) => transitionController.current?.transition({ direction }),
        [],
      );

      const onSeek = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
          const progress = parseInt(event.target.value, 10);
          setSeekValue(progress);

          transitionController.current?.transitionTimeline.in.pause(
            timelineDuration * (progress / 100),
          );
        },
        [timelineDuration],
      );

      return (
        <AddonPanel active={active ?? false} key={key}>
          <div style={{ padding: 20 }}>
            {enableControls ? (
              <>
                {(['in', 'out'] as const).map((direction) => (
                  <ControlRow key={direction}>
                    <Paragraph>Transition {direction}:</Paragraph>
                    <Button outline={true} onClick={() => onTransition(direction)}>
                      Play
                    </Button>
                  </ControlRow>
                ))}
                <ControlRow>
                  <Paragraph>Seek:</Paragraph>
                  <SeekInput
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={seekValue}
                    onChange={onSeek}
                  />
                </ControlRow>
              </>
            ) : (
              <Paragraph>No timeline found for this component!️</Paragraph>
            )}
          </div>
        </AddonPanel>
      );
    },
  });
});

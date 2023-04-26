import { type ComponentFactory } from '@muban/muban';
import { Story } from '@storybook/blocks';
import { type ComponentProps, type ReactElement } from 'react';

export type MubanStoryProps = {
  component: ComponentFactory<never, never>;
  markup: string;
};

export function MubanStory({ ...props }: ComponentProps<typeof Story>): ReactElement {
  return (
    <Story
      {...props}
      parameters={{
        storySource: {
          source: null,
        },
      }}
    />
  );
}

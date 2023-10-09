import type { StorybookConfig } from '@storybook/react-vite';

export default {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  refs: {
    '@mediamonks/muban-transition-component': {
      title: '@mediamonks/muban-transition-component',
      url: '/transition-component/muban-transition-component',
      expanded: false,
    },
    '@mediamonks/react-animation': {
      title: '@mediamonks/react-animation',
      url: '/transition-component/react-animation',
      expanded: false,
    },
    '@mediamonks/@react-transition-presence': {
      title: '@mediamonks/@react-transition-presence',
      url: '/transition-component/react-transition-presence',
      expanded: false,
    },
  },
} satisfies StorybookConfig;

import { createGlobalStyle } from 'styled-components';
import { FontFamily } from './styles/variables';

export const appTheme = {
  app: {
    color: '#f1f1f1',
    background: '#000000',
    codeColor: '#60ffd5',
    codeBackground: '#5b5b5b',
  },

  navigation: {
    color: '#f1f1f1',
    background: '#010101',
  },

  example: {
    captionColor: '#8a8a8a',
  },
} as const;

export type AppTheme = typeof appTheme;

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${FontFamily.Arial};
    color: ${(props) => props.theme.app.color};
    background: ${(props) => props.theme.app.background};
  }
`;

import type { MediaQuery } from '../mediaQuery';

export const respondTo = (query: MediaQuery): string => `only screen and ${query}`;

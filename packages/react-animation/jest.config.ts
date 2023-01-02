import type { Config } from 'jest';

const config: Config = {
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'jsdom',
  transform: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
};

export default config;

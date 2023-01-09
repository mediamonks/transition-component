import type { Config } from 'jest';

export default {
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
} satisfies Config;

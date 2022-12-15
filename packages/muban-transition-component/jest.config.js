/* eslint-disable no-undef, @typescript-eslint/naming-convention, unicorn/prefer-module */
module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
  },
};

/* eslint-disable unicorn/prefer-module, no-undef */
module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  moduleNameMapper: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '^lodash-es$': 'lodash',
  },
};

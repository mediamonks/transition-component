import { render } from '@testing-library/react';
import { TransitionPresence } from './TransitionPresence.js';

describe('TransitionPresence', () => {
  it('should not crash', () => {
    render(<TransitionPresence>{null}</TransitionPresence>);
  });
});

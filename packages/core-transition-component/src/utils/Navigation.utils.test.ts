import { guard } from './Navigation.utils';

test('The callback is triggered immediately', () => {
  const callback = jest.fn();

  guard(callback);
  expect(callback).toHaveBeenCalled();
});

test('The callback is triggered after releasing', () => {
  const callback = jest.fn();

  guard(callback, (release) => release());
  expect(callback).toHaveBeenCalled();
});

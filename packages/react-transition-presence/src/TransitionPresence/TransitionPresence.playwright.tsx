/* eslint-disable react/jsx-no-bind */
import { expect, test } from '@playwright/experimental-ct-react';
import { TestTransitionPresence } from './TransitionPresence.setup.js';

test('should render children', async ({ page, mount }) => {
  await mount(<TestTransitionPresence testid="test" />);

  await expect(page.getByTestId('test')).toBeVisible();
});

test('should not crash/render nothing', async ({ page, mount }) => {
  await mount(<TestTransitionPresence />);
  await expect(page.getByTestId('test')).toBeHidden();
});

test('should defer unmounting child using before unmount callback', async ({ page, mount }) => {
  const result = await mount(<TestTransitionPresence testid="test" />);

  await expect(page.getByTestId('test')).toBeVisible();

  await result.update(<TestTransitionPresence />);

  await expect(page.getByTestId('test')).toBeVisible();
  await expect(page.getByTestId('test')).toBeHidden();
});

test('should add new children after deferred unmount is completed', async ({ page, mount }) => {
  const result = await mount(<TestTransitionPresence testid="child1" />);

  await expect(page.getByTestId('child1')).toBeVisible();

  await result.update(<TestTransitionPresence testid="child2" />);

  await expect(page.getByTestId('child1')).toBeVisible();
  await expect(page.getByTestId('child2')).toBeHidden();

  await expect(page.getByTestId('child1')).toBeHidden();
  await expect(page.getByTestId('child2')).toBeVisible();
});

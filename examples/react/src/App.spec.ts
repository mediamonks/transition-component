import { test, expect } from '@playwright/test';

const baseTestUrl = 'http://localhost:3006';

test('homepage test', async ({ page }) => {
  await page.goto(baseTestUrl);
  const title = page.locator('.home-heading');
  await expect(title).toHaveText('Home');
});

test('about page test', async ({ page }) => {
  await page.goto(`${baseTestUrl}/about`);
  const mainAboutTitle = page.locator('.main-about-heading');
  await expect(mainAboutTitle).toHaveText('This is the about page');
  const lastGridBlock = page.locator('.last-grid-block');
  const secondaryAboutTitle = page.locator('.secondary-about-heading');
  await secondaryAboutTitle.scrollIntoViewIfNeeded();
  await expect(mainAboutTitle).toHaveCSS('opacity',  '1');
  // check if the props have been cleared
  await expect(lastGridBlock).toHaveAttribute('style',  '');
  await expect(secondaryAboutTitle).toHaveText('This is still the about page');
});

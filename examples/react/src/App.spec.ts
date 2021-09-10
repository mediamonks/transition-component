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
  await expect(mainAboutTitle).toHaveText('This is the about page, this animation will only trigger once');
  const lastGridBlock = page.locator('.last-grid-block');
  const fullScreenImageBlock = page.locator('.full-screen-image-block');
  await fullScreenImageBlock.scrollIntoViewIfNeeded();
  await expect(mainAboutTitle).toHaveCSS('opacity',  '1');
  // check if the props have been cleared
  await expect(lastGridBlock).toHaveAttribute('style',  '');
});

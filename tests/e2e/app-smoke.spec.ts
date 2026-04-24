import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (text.includes('Hydration failed')) {
      throw new Error(text);
    }
  });
});

test('home renders and switches restaurant theme', async ({ page }) => {
  await page.goto('/zh/home');

  await expect(page.getByRole('heading', { name: '今天想吃点什么' })).toBeVisible();
  await expect(page.getByRole('link', { name: /去看菜单/ })).toBeVisible();

  const themeToggle = page.getByRole('button', { name: /切换到/ });
  await expect(themeToggle).toBeVisible();
  await themeToggle.click();

  await expect(page.getByRole('button', { name: /切换到/ })).toBeVisible();
  await expect(page.locator('html')).toHaveClass(/sichuan|yunnan/);
});

test('menu category navigation keeps the selected category stable', async ({ page }) => {
  await page.goto('/zh/menu');

  const mainCourse = page.getByRole('button', { name: '主菜' });
  await mainCourse.click();

  await expect(mainCourse).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { name: '主菜' })).toBeInViewport();

  const soup = page.getByRole('button', { name: '汤品' });
  await soup.click();

  await expect(soup).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { name: '汤品' })).toBeInViewport();
});

test('photo wall loads cards and remote images', async ({ page }) => {
  await page.goto('/zh/photo');

  await expect(page.getByText('上传照片')).toBeVisible();
  await expect(page.getByText('图片加载失败')).toHaveCount(0);
  await expect(page.getByRole('img').first()).toBeVisible();
});

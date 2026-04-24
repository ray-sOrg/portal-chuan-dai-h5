import { expect, type Page, test } from '@playwright/test';

async function removeNextDevOverlay(page: Page) {
  await page.evaluate(() => {
    document.querySelectorAll('nextjs-portal').forEach((element) => element.remove());
  });
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const styleId = 'e2e-hide-next-dev-overlay';
    const hideNextDevOverlay = () => {
      const root = document.documentElement;
      if (!root || document.getElementById(styleId)) return;

      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        nextjs-portal {
          display: none !important;
          pointer-events: none !important;
        }
      `;
      root.appendChild(style);
      document.querySelectorAll('nextjs-portal').forEach((element) => element.remove());
    };

    hideNextDevOverlay();
    window.addEventListener('DOMContentLoaded', hideNextDevOverlay, { once: true });
    const observer = new MutationObserver(hideNextDevOverlay);
    window.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    });
  });

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

test('language menu exposes Chinese and English options', async ({ page }) => {
  await page.goto('/zh/home');

  await page.getByRole('button', { name: '语言' }).click();

  await expect(page.getByRole('button', { name: /中文/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /English/ })).toBeVisible();
});

test('bottom navigation moves between primary tabs', async ({ page }) => {
  await page.goto('/zh/home');

  await page.getByRole('button', { name: '菜单' }).click();
  await expect(page).toHaveURL(/\/zh\/menu$/);
  await expect(page.getByPlaceholder('搜索菜品')).toBeVisible();

  await page.getByRole('button', { name: '照片墙' }).click();
  await expect(page).toHaveURL(/\/zh\/photo$/);
  await expect(page.getByText('上传照片')).toBeVisible();

  await removeNextDevOverlay(page);
  await page.getByRole('button', { name: '首页' }).click({ force: true });
  await expect(page).toHaveURL(/\/zh\/home$/);
  await expect(page.getByRole('heading', { name: '今天想吃点什么' })).toBeVisible();
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

test('menu search filters dishes by keyword', async ({ page }) => {
  await page.goto('/zh/menu');

  await page.getByPlaceholder('搜索菜品').fill('麻婆');

  await expect(page.getByRole('heading', { name: '麻婆豆腐' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '口水鸡' })).toHaveCount(0);
});

test('menu can add a dish to the local cart', async ({ page }) => {
  await page.goto('/zh/menu');

  await page.getByRole('heading', { name: '傣味鬼鸡' }).click();
  await expect(page.getByRole('heading', { name: '傣味鬼鸡', level: 2 })).toBeVisible();

  await page.getByRole('button', { name: /确认添加到菜单/ }).click();

  const cartButton = page.getByRole('button', { name: '购物车' });
  await expect(cartButton).toBeVisible();
  await cartButton.click();

  await expect(page.getByRole('heading', { name: /购物车/ })).toBeVisible();
  await expect(page.getByText('傣味鬼鸡').last()).toBeVisible();
});

test('cart quantity controls and clear action work locally', async ({ page }) => {
  await page.goto('/zh/menu');

  await page.getByRole('heading', { name: '傣味鬼鸡' }).click();
  await page.getByRole('button', { name: /确认添加到菜单/ }).click();

  const cartButton = page.getByRole('button', { name: '购物车' });
  await expect(cartButton).toBeVisible();
  await cartButton.click();

  await page.getByRole('button', { name: '增加数量' }).click();
  await expect(page.getByText('x 2')).toBeVisible();

  await removeNextDevOverlay(page);
  await page.getByRole('button', { name: '清空' }).click({ force: true });
  await expect(page.getByRole('button', { name: '购物车' })).toHaveCount(0);
});

test('photo wall loads cards and remote images', async ({ page }) => {
  await page.goto('/zh/photo');

  await expect(page.getByText('上传照片')).toBeVisible();
  await expect(page.getByText('图片加载失败')).toHaveCount(0);
  await expect(page.getByRole('img').first()).toBeVisible();
});

test('photo detail opens from the photo wall', async ({ page }) => {
  await page.goto('/zh/photo');

  const firstPhoto = page.getByRole('link').filter({ has: page.getByRole('img') }).first();
  await expect(firstPhoto).toBeVisible();
  await firstPhoto.click();

  await expect(page).toHaveURL(/\/zh\/photo\/[^/]+$/);
  await expect(page.getByText(/收藏/).first()).toBeVisible();
  await expect(page.getByRole('img').first()).toBeVisible();
});

test('uploading photos requires sign in', async ({ page }) => {
  await page.goto('/zh/photo');

  await page.getByText('上传照片').click();

  await expect(page).toHaveURL(/\/zh\/sign-in/);
  await expect(page.getByRole('heading', { name: '欢迎回来' })).toBeVisible();
});

test('sign in page links to registration and password recovery', async ({ page }) => {
  await page.goto('/zh/sign-in');

  await expect(page.getByPlaceholder('请输入账号或手机号')).toBeVisible();
  await expect(page.getByPlaceholder('请输入密码')).toBeVisible();

  await page.getByRole('link', { name: '注册' }).click();
  await expect(page).toHaveURL(/\/zh\/sign-up$/);

  await page.goto('/zh/sign-in');
  await page.getByRole('link', { name: '忘记密码' }).click();
  await expect(page).toHaveURL(/\/zh\/forgot-password$/);
});

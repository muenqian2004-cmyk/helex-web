import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:5230';

test('WelcomeScreen shows and can be dismissed', async ({ page }) => {
  await page.goto(BASE);
  // Should show hero title
  await expect(page.getByRole('heading', { name: '欢迎，尊敬的' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '英雄联盟召唤师' })).toBeVisible();
  await expect(page.getByText('属于每个人的游戏工具')).toBeVisible();
  // Should have 颜色 and 音效 buttons in top right
  await expect(page.getByText('颜色')).toBeVisible();
  await expect(page.getByText('音效')).toBeVisible();
  // Click Start to enter
  await page.getByText('Start').click();
  // Should now see main homepage
  await expect(page.locator('h1')).toContainText('Aerilia海克斯大乱斗工具');
});

test('WelcomeScreen audio settings dialog works', async ({ page }) => {
  await page.goto(BASE);
  await page.getByText('音效').click();
  await expect(page.getByText('音效设置')).toBeVisible();
  await expect(page.getByText('中文')).toBeVisible();
  await expect(page.getByText('English')).toBeVisible();
  // Close by clicking the dark backdrop area (top-left corner)
  await page.mouse.click(10, 10);
  await expect(page.getByText('音效设置')).not.toBeVisible();
});

test('WelcomeScreen theme dialog works from welcome', async ({ page }) => {
  await page.goto(BASE);
  await page.getByText('颜色').click();
  await expect(page.getByText('浅色')).toBeVisible();
  await expect(page.getByText('深色')).toBeVisible();
  // Click light to select and close
  await page.getByText('浅色').click();
});

test('After welcome, site functions normally', async ({ page }) => {
  await page.goto(BASE);
  // Dismiss welcome
  await page.getByText('Start').click();
  // Should see normal page
  await expect(page.getByText('强化百科')).toBeVisible();
  await expect(page.getByText('无敌套路')).toBeVisible();
});

test('Augments page works after welcome', async ({ page }) => {
  await page.goto(BASE);
  await page.getByText('Start').click();
  await page.waitForSelector('a[href="/augments"]', { timeout: 3000 });
  await page.locator('a[href="/augments"]').first().click();
  await page.waitForURL('**/augments', { timeout: 5000 });
  await expect(page.locator('h1')).toContainText('强化百科');
});

test('HeroCards works after welcome', async ({ page }) => {
  await page.goto(BASE);
  await page.getByText('Start').click();
  await page.getByText('英雄速查卡').click();
  await expect(page.getByText('推荐强化符文').first()).toBeVisible();
});

test('TripleChoice works after welcome', async ({ page }) => {
  await page.goto(BASE);
  await page.getByText('Start').click();
  await page.getByText('三选一强化助手').click();
  await expect(page.locator('h1')).toContainText('三选一强化助手');
});

test('ItemsPage shows 200 items with search', async ({ page }) => {
  await page.goto(BASE);
  await page.getByText('Start').click();
  await page.getByText('装备查询').click();
  await expect(page.locator('h1')).toContainText('装备查询');
  await expect(page.getByText(/共收录 200 件装备/)).toBeVisible();
  // Search for specific item
  const searchInput = page.locator('input[placeholder*="搜索"]');
  await searchInput.fill('三相之力');
  await expect(page.getByText('三相之力')).toBeVisible();
  // Click to expand
  await page.getByText('三相之力').click();
  await expect(page.getByText('合成：').first()).toBeVisible();
});

test('Simulator loads and shows results', async ({ page }) => {
  await page.goto(BASE);
  await page.getByText('Start').click();
  await page.getByText('模拟器').click();
  await expect(page.locator('h1')).toContainText('瑞兹');
  // Should show left config panels
  await expect(page.getByText('海克斯符文')).toBeVisible();
  await expect(page.getByText('装备栏')).toBeVisible();
  // Should show right result panel
  await expect(page.getByText('模拟结果')).toBeVisible();
  await expect(page.getByText(/数值溢出|数值收敛/)).toBeVisible();
});

test('BuildRecommendations shows results for hero + augments', async ({ page }) => {
  await page.goto(BASE);
  await page.getByText('Start').click();
  // Navigate via NavBar
  await page.locator('nav a:has-text("强化出装")').click();
  await expect(page.locator('h1')).toContainText('强化驱动出装');
  // Select hero
  const heroInput = page.locator('input[placeholder*="搜索英雄"]');
  await heroInput.fill('瑞兹');
  await page.getByText('符文法师').click();
  // Should show loader
  await page.waitForTimeout(500);
  // Should find recommendation sections
  await expect(page.getByText(/核心装备|可选装备|情况装备/).first()).toBeVisible({ timeout: 5000 });
});

test('InvincibleCombos works after welcome', async ({ page }) => {
  await page.goto(BASE);
  await page.getByText('Start').click();
  await page.getByText('无敌套路').click();
  await expect(page.getByText('核心机制').first()).toBeVisible();
});

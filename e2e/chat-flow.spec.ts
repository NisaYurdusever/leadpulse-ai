import { test, expect } from '@playwright/test';

test('primary chat and tool execution workflow', async ({ page }) => {
  // 1. Chat sayfasına git
  await page.goto('/chat');

  // 2. Başlığın ve kontrollerin yüklendiğini doğrula
  await expect(page.getByRole('button', { name: /trigger scorelead/i })).toBeVisible();

  // 3. Tool tetikleme butonuna tıkla
  await page.getByRole('button', { name: /trigger scorelead/i }).click();

  // 4. Skor kartı çıktısının ekrana başarıyla yansıdığını doğrula
  await expect(page.getByText(/LEAD QUALIFICATION SCORECARD/i)).toBeVisible({ timeout: 10000 });
  await expect(page.getByText('Tier 1 (High Intent)')).toBeVisible();
});
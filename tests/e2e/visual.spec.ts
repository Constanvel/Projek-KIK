import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('capture reference-size screens and check active visit assets', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.setViewportSize({ width: 412, height: 916 });
  await page.goto('/poliklinik');
  await page.getByRole('link', { name: /^Penyakit Dalam/ }).click();
  await page.getByRole('button', { name: 'Ambil antrean', exact: true }).click();
  await page.getByRole('link', { name: 'Tampilkan QR check-in' }).click();
  await page.getByRole('button', { name: 'Simulasikan konfirmasi petugas' }).click();
  await page.getByRole('link', { name: 'Lihat antrean saya' }).click();
  await expect(page.getByRole('heading', { name: 'Menunggu giliran' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath('queue-412.png'),
    fullPage: true,
    animations: 'disabled',
  });
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2aa', 'wcag22aa']).analyze()).violations,
  ).toEqual([]);
  for (const image of await page.locator('img').all()) {
    await expect(image).toBeVisible();
    expect(
      await image.evaluate(
        (element: HTMLImageElement) => element.complete && element.naturalWidth > 0,
      ),
    ).toBe(true);
  }
  await page.getByRole('link', { name: /Perlu bantuan layanan/ }).click();
  await expect(page.getByRole('heading', { name: 'Halo, saya Hya.' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath('hya-412.png'),
    fullPage: true,
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('/petugas');
  await expect(page.getByRole('heading', { name: 'Antrean poli' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath('staff-1440.png'),
    fullPage: true,
    animations: 'disabled',
  });
  await page.goto('/manajemen');
  await expect(page.getByRole('heading', { name: 'Ringkasan layanan' })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath('management-1440.png'),
    fullPage: true,
    animations: 'disabled',
  });
  expect(errors).toEqual([]);
});

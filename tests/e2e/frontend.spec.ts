import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function book(page: Page) {
  await page.goto('/poliklinik');
  await page.getByRole('link', { name: /^Penyakit Dalam/ }).click();
  await page.getByRole('button', { name: 'Ambil antrean', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Tiket kunjungan' })).toBeVisible();
}
test('patient flow, companion revocation and pharmacy completion', async ({ page }) => {
  await book(page);
  await page.getByRole('link', { name: 'Tampilkan QR check-in' }).click();
  await page.getByRole('button', { name: 'Nomor check-in manual' }).click();
  await expect(page.getByText('Nomor contoh: HT-842027.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Simulasikan konfirmasi petugas' }).click();
  await page.getByRole('link', { name: 'Lihat antrean saya' }).click();
  await expect(page.getByRole('heading', { name: 'Menunggu giliran' })).toBeVisible();
  await page.getByRole('link', { name: 'Bagikan ke pendamping' }).click();
  await page.getByRole('button', { name: 'Aktifkan pratinjau pendamping' }).click();
  await page.getByRole('link', { name: 'Buka pratinjau pendamping' }).click();
  await expect(page.getByRole('heading', { name: 'Siti A.' })).toBeVisible();
  await page.getByRole('button', { name: 'Berhenti memantau' }).click();
  await expect(page.getByText('Pratinjau akses tidak aktif', { exact: false })).toBeVisible();
  await page.getByRole('link', { name: 'Kunjungan', exact: true }).click();
  await page.getByRole('button', { name: 'Simulasikan pemeriksaan selesai' }).click();
  await page.getByRole('button', { name: 'Simulasikan lanjut ke farmasi' }).click();
  await page.getByRole('button', { name: 'Simulasikan obat siap' }).click();
  await page.getByRole('button', { name: 'Simulasikan pengambilan selesai' }).click();
  await expect(page.getByRole('heading', { name: 'Kunjungan selesai' })).toBeVisible();
});
test('clinic search, missing schedules and date availability', async ({ page }) => {
  await page.goto('/poliklinik');
  await page.getByRole('textbox', { name: 'Cari nama poliklinik' }).fill('tidak ada');
  await expect(page.getByRole('heading', { name: 'Poliklinik tidak ditemukan' })).toBeVisible();
  await page.getByRole('button', { name: 'Hapus pencarian' }).click();
  await page.getByRole('link', { name: /^Jantung/ }).click();
  await expect(page.getByRole('heading', { name: 'Jadwal belum tersedia' })).toBeVisible();
  await page.getByRole('link', { name: 'Lihat contoh Penyakit Dalam' }).click();
  await page.getByRole('button', { name: 'Kam 5 Nov' }).click();
  await expect(page.getByRole('button', { name: 'Ambil antrean', exact: true })).toBeDisabled();
});
test('Hya structured replies and help search', async ({ page }) => {
  await page.goto('/hya');
  await page.getByRole('button', { name: 'Kapan giliran saya?' }).click();
  await expect(page.getByRole('log')).toContainText('Belum ada kunjungan aktif');
  await page.getByRole('textbox', { name: 'Pertanyaan untuk Hya' }).fill('Apa dosis obat saya?');
  await page.getByRole('button', { name: 'Kirim pertanyaan' }).click();
  await expect(page.getByRole('log')).toContainText('tenaga kesehatan');
  await page.goto('/bantuan');
  await page.getByRole('textbox', { name: 'Cari topik bantuan' }).fill('QR');
  await expect(page.getByRole('link', { name: /^Check-in dengan QR/ })).toBeVisible();
});
test('staff guards, queue actions and history', async ({ page }) => {
  await page.goto('/petugas');
  await expect(page.getByRole('button', { name: 'Tidak hadir', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Panggil pasien berikutnya' })).toBeDisabled();
  await page.getByRole('button', { name: 'Panggil ulang', exact: true }).click();
  await page.getByRole('button', { name: 'Tidak hadir', exact: true }).click();
  await page.getByRole('button', { name: 'Panggil pasien berikutnya' }).click();
  await page.getByRole('button', { name: 'Selesai & lanjutkan layanan' }).click();
  await page.getByRole('button', { name: 'Riwayat aktivitas' }).click();
  await expect(page.getByText('Simulasi · A-024 selesai, lanjut layanan')).toBeVisible();
});
test('management filtering, empty state and CSV download', async ({ page }) => {
  await page.goto('/manajemen');
  await page.getByRole('combobox', { name: 'Filter poliklinik' }).selectOption('Jantung');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /Ekspor laporan/ }).click();
  expect((await download).suggestedFilename()).toBe('hytrack-laporan-contoh-2026-11-04.csv');
  await page.getByRole('combobox', { name: 'Tanggal laporan' }).selectOption('3 Nov 2026');
  await expect(page.getByRole('heading', { name: 'Belum ada data contoh' })).toBeVisible();
});
for (const width of [320, 375, 412, 768, 1024, 1440]) {
  test(`responsive routes have no overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 960 });
    for (const route of [
      '/',
      '/poliklinik',
      '/dokter',
      '/hya',
      '/bantuan',
      '/petugas',
      '/manajemen',
    ]) {
      await page.goto(route);
      await expect(page.getByRole('heading', { name: 'Memuat HyTrack…' })).toHaveCount(0);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        route,
      ).toBe(true);
    }
  });
}
test('representative pages pass automated accessibility and runtime checks', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of [
    '/',
    '/poliklinik',
    '/dokter',
    '/hya',
    '/bantuan',
    '/petugas',
    '/manajemen',
  ]) {
    await page.goto(route);
    await expect(page.getByRole('heading', { name: 'Memuat HyTrack…' })).toHaveCount(0);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    const scan = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(scan.violations, route).toEqual([]);
  }
  expect(errors).toEqual([]);
});
test('onboarding guide follows the flow, can be skipped and reopened without losing the visit', async ({
  page,
}) => {
  await page.goto('/');
  const hint = page.locator('.guide-hint');
  await expect(hint).toContainText('LANGKAH 1 DARI 7');
  await expect(hint).toContainText('Pastikan nama pasien benar');
  await expect(page.locator('.guide-active [data-guide]')).toHaveCount(2);
  await page.getByRole('button', { name: 'Mengerti' }).click();
  await expect(hint).toHaveCount(0);
  await page.getByRole('link', { name: '+ Ambil antrean' }).click();
  await expect(hint).toContainText('Pilih poliklinik tujuan');
  await page.getByRole('link', { name: /^Penyakit Dalam/ }).click();
  await expect(hint).toContainText('LANGKAH 3 DARI 7');
  await page.getByRole('button', { name: 'Ambil antrean', exact: true }).click();
  await expect(hint).toContainText('Perhatikan waktu berangkat');
  await page.getByRole('button', { name: 'Lewati panduan' }).click();
  await expect(hint).toHaveCount(0);
  await page.getByRole('link', { name: 'Beranda', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Lihat kunjungan' })).toBeVisible();
  await page.getByRole('button', { name: 'Tampilkan panduan penggunaan' }).click();
  await page.getByRole('link', { name: 'Kunjungan', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Tiket kunjungan' })).toBeVisible();
  await expect(hint).toContainText('Perhatikan waktu berangkat');
  await page.getByRole('link', { name: 'Tampilkan QR check-in' }).click();
  await expect(hint).toContainText('Tunjukkan QR ke petugas');
});

# Audit frontend Phase 2

Tanggal: 4 November 2026. Lingkungan lokal Windows, Node.js 24.16.0, Chromium Playwright.

## Hasil yang dijalankan

| Pemeriksaan | Hasil |
| --- | --- |
| ESLint, tanpa warning | Lulus |
| TypeScript `tsc --noEmit` | Lulus |
| Vitest | 27 test lulus, 2 file |
| Next.js production build | Lulus; `.next/BUILD_ID` diterbitkan |
| Playwright Chromium | 13 test lulus |
| Alur pasien | Booking → QR contoh → konfirmasi demo → antrean → laboratorium → farmasi → selesai lulus |
| Pendamping | Aktivasi pratinjau, pantauan read-only, pencabutan lulus |
| Petugas | Guard panggil berikutnya, panggil ulang sebelum tidak hadir, selesai, riwayat lokal lulus |
| Manajemen | Filter poli, tanggal kosong, unduh CSV lulus |
| Hya/bantuan | Respons terstruktur, batas pertanyaan medis, pencarian topik lulus |
| Overflow responsif | Beranda, poli, dokter, Hya, bantuan, petugas, manajemen lulus pada 320/375/412/768/1024/1440px |
| axe WCAG A/AA terpilih | Tidak ada violation pada 7 halaman representatif dan antrean aktif; bukan sertifikasi WCAG |
| Runtime | Tidak ada `pageerror` pada halaman representatif; tidak ada console error pada sesi screenshot antrean/Hya/petugas/manajemen |
| Asset | 14 unit test memverifikasi PNG/SVG lokal; gambar antrean yang terlihat berhasil dimuat |
| Reduced motion | Halaman representatif diuji dengan preferensi reduce; CSS menonaktifkan transisi/animasi |

Perintah langsung yang digunakan: `node node_modules/eslint/bin/eslint.js . --max-warnings 0`, `node node_modules/typescript/bin/tsc --noEmit`, `node node_modules/vitest/vitest.mjs run`, `node node_modules/next/dist/bin/next build`, `node node_modules/@playwright/test/cli.js test`. Script npm yang setara tersedia di package.json.

## Iterasi visual

Screenshot lokal dihasilkan oleh `tests/e2e/visual.spec.ts`: antrean dan Hya 412px, petugas dan manajemen 1440px. Dibaca dan dibandingkan secara manual dengan screenshot Figma. Perbaikan mencakup dimensi SVG asli, posisi metrik antrean, ilustrasi Hya, gap kartu, dan alignment statistik.

Perbedaan yang disengaja:
- Plus Jakarta Sans menggantikan Inter pada layar utama sesuai keputusan pengguna.
- Disclosure demo menggantikan status bar OS. Gesture bar OS tidak direplikasi.
- Teks koneksi langsung diganti label data lokal; tidak ada indikator realtime palsu.
- Kontrol simulasi tersedia di luar desain agar frontend dapat dicoba.
- Warna teks muted digelapkan dari `#607570` menjadi `#566c65`, dan teks kecil pada primary diperterang, setelah axe menemukan masalah kontras pada pale green.
- Dashboard hanya memakai enam baris pasien yang benar-benar tersedia, bukan menciptakan 12 pasien tambahan demi pagination desain.
- State kosong menandai jadwal dan rincian analitik yang tidak tersedia.

Belum pixel-perfect terverifikasi secara numerik. Tidak ada pixel-diff otomatis terhadap baseline Figma. Screenshot artefak Playwright berada pada `test-results/` dan tidak dikomit.

## Belum diverifikasi / bukan cakupan

- Safari, Firefox, perangkat fisik, screen reader, zoom 200–400%, dan seluruh kombinasi orientasi.
- Audit performa Lighthouse/Core Web Vitals dan pengujian beban.
- Audit keamanan produksi, pentest, autentikasi/otorisasi, integrasi API, notifikasi, data medis, dan realtime.
- Provider AI Hya, denah rumah sakit, kontak pasien, tautan pendamping lintas perangkat, expiry server, audit log persisten.
- Sinkronisasi dashboard petugas dengan state pasien; keduanya simulasi lokal terpisah.

Tidak ada klaim production-ready. Jangan gunakan dengan pasien atau data nyata.

## Kendala lingkungan yang dipulihkan

Instalasi npm beberapa kali timeout. Paket native SWC Windows hasil instalasi parsial tidak valid; paket generated di node_modules diunduh ulang. Instalasi akhirnya selesai menggunakan npm 11.13.0 bawaan Node, tanpa mengubah konfigurasi npm global. Lockfile dikomit untuk instalasi reproduktif.

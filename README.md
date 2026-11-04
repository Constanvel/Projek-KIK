# HyTrack

Frontend aplikasi antrean rumah sakit berdasarkan [Figma KIK-mcp](https://www.figma.com/design/wsbQBOCVHrEwO6GGhLe8Yy/KIK-mcp). Menggunakan **Plus Jakarta Sans**, Next.js App Router, React, TypeScript, dan CSS semantik.

> **Demo frontend saja.** Tidak terhubung ke rumah sakit, autentikasi, database, realtime, provider AI, atau sistem farmasi. Semua nama, waktu, nomor antrean, dan statistik adalah contoh desain. Jangan masukkan informasi pribadi atau medis.

## Menjalankan

Node.js 22.13+ atau 24 LTS, npm.

```sh
npm ci
npm run dev
```

Buka http://localhost:3000.

```sh
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm start
```

Playwright menjalankan development server lokal secara otomatis. Browser binary perlu diunduh sekali. `npm run build` harus selesai sebelum `npm start`.

## Halaman

| URL                 | Tampilan                                                         |
| ------------------- | ---------------------------------------------------------------- |
| `/`                 | Beranda pasien                                                   |
| `/poliklinik`       | Pencarian poliklinik                                             |
| `/dokter`           | Dokter dan jadwal contoh Penyakit Dalam                          |
| `/kunjungan`        | Tiket, antrean, laboratorium, farmasi, atau selesai sesuai state |
| `/check-in`         | QR contoh dan konfirmasi simulasi                                |
| `/pendamping`       | Aktifkan/cabut pratinjau pendamping                              |
| `/pantauan`         | Tampilan pendamping read-only lokal                              |
| `/hya`              | Panduan respons terstruktur, bukan AI                            |
| `/bantuan`          | Pencarian panduan                                                |
| `/bantuan/check-in` | Panduan check-in                                                 |
| `/bantuan/antrean`  | Panduan antrean                                                  |
| `/petunjuk-ruangan` | Teks petunjuk dari desain, tanpa denah palsu                     |
| `/akun`             | Indeks akun/peran demo; bukan autentikasi                        |
| `/petugas`          | Dashboard simulasi antrean petugas                               |
| `/manajemen`        | Statistik agregat contoh, filter, grafik, ekspor CSV             |

## Mencoba flow

1. Pilih **Ambil antrean**, **Penyakit Dalam**, lalu jadwal **4 Nov**. Jadwal tanggal/poli lainnya menampilkan keterbatasan data desain.
2. Ambil tiket, buka QR, lalu gunakan **Simulasikan konfirmasi petugas**. QR tidak valid untuk rumah sakit.
3. Buka antrean dan coba pratinjau pendamping. Pratinjau hanya berlaku pada state sesi React yang sama, bukan tautan aman lintas perangkat.
4. Gunakan kontrol demo untuk melanjutkan ke laboratorium, farmasi, dan menyelesaikan kunjungan.
5. Dashboard petugas memiliki data lokal terpisah. Status tidak hadir hanya aktif setelah panggilan ulang. Data petugas tidak menyinkronkan sesi pasien.
6. Dashboard manajemen memfilter data contoh dan mengekspor CSV berlabel contoh.

State berada di memori. Navigasi client mempertahankan state; refresh mengembalikannya ke awal. Ini disengaja agar tidak menyimpan informasi kesehatan pada browser.

## Struktur

```text
src/app/                  Route, layout, loading/error/404
src/components/           Shell responsif dan primitive UI
src/features/demo/        Reducer state demo dan aturan transisi
src/features/patient/     Booking, kunjungan, pendamping
src/features/help/        Bantuan dan Hya
src/features/operations/  Petugas, manajemen, data agregat
src/styles/               Dashboard CSS
tests/unit/               Aturan domain demo
tests/e2e/                Flow browser, breakpoint, axe
public/assets/            Asset Figma lokal
docs/                     Keputusan desain dan audit
```

## Deployment

Deploy ke hosting Node.js yang mendukung Next.js. Tidak membutuhkan environment variable atau secrets untuk mode frontend ini.

```sh
npm ci
npm run build
npm start
```

Gunakan HTTPS pada deployment publik. Semua halaman peran sengaja terbuka sebagai demo; **jangan menambahkan data nyata** sebelum autentikasi dan otorisasi server diterapkan. Data demo tidak boleh digunakan untuk keputusan operasional rumah sakit.

## Batas fidelity dan integrasi

- Font dan token dinormalisasi ke Plus Jakarta Sans atas persetujuan pengguna. Frame asli versi Inter tidak identik setelah adaptasi.
- Mobile mengacu pada 412px; dashboard pada 1440px. Breakpoint lain adalah adaptasi.
- Status bar dan gesture bar Android tidak direplikasi karena merupakan UI OS.
- Disclosure demo dan kontrol simulasi merupakan tambahan yang disengaja.
- Halaman Akun, Notifikasi kosong, dan state error adalah UI pendukung; tidak memiliki frame final Figma.
- Hya memakai pencocokan topik lokal. Tidak memanggil AI dan tidak memberikan saran medis.
- Tidak ada klaim production-ready, tautan pendamping aman, validitas QR, akses peran, atau realtime produksi.

Lihat [keputusan Phase 2](docs/phase-2.md), [provenance asset](docs/assets.md), dan [status audit](docs/audit.md).

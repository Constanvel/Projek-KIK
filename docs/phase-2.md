# Phase 2 — Frontend HyTrack

## Keputusan

- Plus Jakarta Sans menjadi font seluruh aplikasi sesuai persetujuan pengguna.
- Versi antrean 1:910 dan Hya 1:863/1:967 menjadi referensi Jakarta Sans.
- Layar utama lain diadaptasi ke token Jakarta Sans; bukan salinan pixel-identik versi Inter.
- Next.js App Router, React, TypeScript, CSS semantik tanpa UI theme eksternal.
- Frontend saja. Semua data bersifat demonstrasi; tidak ada autentikasi, AI, API rumah sakit, atau realtime produksi.
- Navigasi utama: Beranda, Kunjungan, Akun. Bantuan diakses melalui Akun/Hya.
- Akun belum memiliki frame Figma: hanya indeks navigasi demo, bukan rancangan akun produksi.
- State kunjungan demo lokal, tanpa identitas medis nyata. Tidak ada tautan pendamping aman tanpa backend.

## Referensi

https://www.figma.com/design/wsbQBOCVHrEwO6GGhLe8Yy/KIK-mcp

Mobile: 412px. Petugas/manajemen: 1440px. Ukuran lainnya adalah adaptasi responsif.

## Urutan pekerjaan

1. Fondasi, token, assets lokal, shell navigasi.
2. Beranda, pemilihan poli/jadwal, tiket.
3. Check-in demo, antrean, layanan, farmasi.
4. Pendamping, bantuan, Hya berbasis respons terstruktur.
5. Dashboard petugas dan manajemen.
6. Unit/E2E/accessibility tests, audit responsif, build, dokumentasi.

## Batas integrasi

QR contoh tidak valid. Check-in hanya melalui tombol simulasi berlabel. Data tidak dikirim ke rumah sakit. Hya tidak memanggil model AI. Akses pendamping hanya pratinjau lokal, bukan otorisasi. Kontak pasien dan denah belum tersedia; jangan membuat nomor telepon atau denah palsu.

import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="error-page">
      <p className="eyebrow">404 · HYTRACK</p>
      <h1>Halaman tidak ditemukan</h1>
      <p className="muted">Periksa alamat atau kembali ke beranda.</p>
      <Link className="button" href="/">
        Kembali ke beranda
      </Link>
    </main>
  );
}

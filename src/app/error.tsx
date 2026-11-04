'use client';
import Link from 'next/link';
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" className="error-page">
      <h1>Halaman belum dapat dimuat</h1>
      <p className="muted">Coba lagi. Data demo tidak dikirim ke rumah sakit.</p>
      <button className="button" onClick={reset}>
        Coba lagi
      </button>
      <Link className="button secondary" href="/">
        Kembali ke beranda
      </Link>
    </main>
  );
}

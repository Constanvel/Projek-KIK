'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Shell, HyaHelp } from '@/components/shell';
import { ActionLink, Icon } from '@/components/ui';
import { useDemo } from '@/features/demo/demo-provider';
export function Home() {
  const { state } = useDemo();
  const active = state.visit && state.visit.stage !== 'complete';
  return (
    <Shell title="HyTrack" subtitle="RS Harapan Sehat">
      <section className="intro">
        <h2>Berobat lebih tenang.</h2>
        <p>Pantau antrean. Datang tepat waktu.</p>
      </section>
      <section className="hero">
        <p className="eyebrow">RAWAT JALAN</p>
        <h2>
          {active ? (
            <>
              Kunjungan Anda
              <br />
              A-027
            </>
          ) : (
            <>
              Belum ada
              <br />
              kunjungan aktif
            </>
          )}
        </h2>
        <p>
          {active
            ? `${state.visit?.clinic} · ${state.visit?.doctor}`
            : 'Ambil antrean untuk poliklinik dan dokter pilihan Anda.'}
        </p>
        <Link className="button white" href={active ? '/kunjungan' : '/poliklinik'}>
          {active ? 'Lihat kunjungan' : '+ Ambil antrean'}
        </Link>
      </section>
      <section className="profile-row">
        <div>
          <p className="eyebrow">PASIEN TERPILIH · DATA CONTOH</p>
          <h3>Siti Aminah</h3>
          <p className="muted">No. RM •••• 0842</p>
        </div>
        <Link className="text-button" href="/akun">
          Ganti
        </Link>
      </section>
      <hr />
      <section>
        <h3>Sebelum ke rumah sakit</h3>
        <ol className="plain-list">
          <li>Siapkan kartu identitas dan rujukan.</li>
          <li>Pilih poliklinik dan jadwal dokter.</li>
          <li>Check-in saat tiba di rumah sakit.</li>
        </ol>
      </section>
      <Link className="inline-link" href="/bantuan">
        <Icon name="heart" />
        Butuh bantuan? Hubungi petugas.
      </Link>
      <HyaHelp />
    </Shell>
  );
}
export function Account() {
  const { dispatch } = useDemo();
  const [resetDone, setResetDone] = useState(false);
  return (
    <Shell title="Akun" subtitle="Navigasi demonstrasi frontend">
      <section className="card">
        <p className="eyebrow">DATA CONTOH · BUKAN AKUN TERAUTENTIKASI</p>
        <h2>Siti Aminah</h2>
        <p className="muted">No. RM •••• 0842</p>
        <p>
          Penggantian pasien memerlukan autentikasi dan API rumah sakit. Fitur tersebut belum
          tersedia pada frontend ini.
        </p>
      </section>
      <ActionLink href="/bantuan" secondary>
        Bantuan & panduan kunjungan
      </ActionLink>
      <ActionLink href="/hya" secondary>
        Tanya Hya
      </ActionLink>
      <section className="card stack">
        <h3>Jelajahi tampilan peran</h3>
        <p className="muted small">Halaman demo terbuka. Ini bukan kontrol akses produksi.</p>
        <ActionLink href="/petugas" secondary>
          Ruang petugas
        </ActionLink>
        <ActionLink href="/manajemen" secondary>
          Manajemen layanan
        </ActionLink>
      </section>
      <button
        className="button danger"
        onClick={() => {
          dispatch({ type: 'reset' });
          setResetDone(true);
        }}
      >
        Reset data kunjungan demo
      </button>
      <p className="status-line" role="status">
        {resetDone ? 'Data kunjungan dan pratinjau pendamping telah direset.' : ''}
      </p>
    </Shell>
  );
}

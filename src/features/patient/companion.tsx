'use client';
import { useState } from 'react';
import { Shell } from '@/components/shell';
import { ActionLink, Notice } from '@/components/ui';
import { useDemo } from '@/features/demo/demo-provider';
import { dateLabel } from '@/features/demo/model';
export function CompanionAccess() {
  const { state, dispatch } = useDemo();
  const [status, setStatus] = useState('');
  if (!state.visit || state.visit.stage === 'complete')
    return (
      <Shell title="Akses pendamping" back="/kunjungan">
        <Notice tone="warning">Tidak ada kunjungan aktif untuk dibagikan.</Notice>
        <ActionLink href="/kunjungan">Buka kunjungan</ActionLink>
      </Shell>
    );
  return (
    <Shell title="Akses pendamping" subtitle="KELOLA AKSES KUNJUNGAN" back="/kunjungan">
      <h2>Biar keluarga ikut tenang.</h2>
      <p className="muted">Bagikan perkembangan kunjungan, bukan informasi medis Anda.</p>
      <section className="hero">
        <p className="eyebrow">KUNJUNGAN HARI INI</p>
        <h2 style={{ fontSize: 23 }}>Siti Aminah · {state.visit.ticket}</h2>
        <p className="small">{dateLabel(state.visit.date)} · RS Harapan Sehat</p>
      </section>
      <section className="card">
        <h3>Yang bisa dilihat pendamping</h3>
        <ul className="checklist">
          <li>✓ Status dan nomor antrean</li>
          <li>✓ Perkiraan waktu tunggu</li>
          <li>✓ Lokasi layanan berikutnya</li>
          <li>✓ Proses penyiapan obat</li>
        </ul>
        <hr />
        <p className="muted">
          Tidak termasuk diagnosis, hasil pemeriksaan, detail resep, atau nomor rekam medis.
        </p>
      </section>
      <section className="warning-card">
        <h3>Akses otomatis berakhir</h3>
        <p>Saat kunjungan selesai atau hari ini pukul 23.59, mana yang lebih dulu.</p>
      </section>
      <p className="muted">
        Hanya bagikan kepada orang tepercaya. Anda dapat mencabut akses kapan saja di halaman
        kunjungan.
      </p>
      <Notice tone="info">
        Frontend hanya menyediakan pratinjau pada sesi ini. Tautan aman dan masa berlaku memerlukan
        backend; belum diaktifkan.
      </Notice>
      {!state.companion ? (
        <button
          className="button"
          onClick={() => {
            dispatch({ type: 'companion', enabled: true });
            setStatus('Pratinjau pendamping diaktifkan pada sesi demo.');
          }}
        >
          Aktifkan pratinjau pendamping
        </button>
      ) : (
        <>
          <ActionLink href="/pantauan">Buka pratinjau pendamping</ActionLink>
          <button
            className="button danger"
            onClick={() => {
              dispatch({ type: 'companion', enabled: false });
              setStatus('Pratinjau pendamping dinonaktifkan.');
            }}
          >
            Cabut pratinjau akses
          </button>
        </>
      )}
      <p role="status" className="status-line">
        {status}
      </p>
    </Shell>
  );
}
export function CompanionView() {
  const { state, dispatch } = useDemo();
  if (!state.companion || !state.visit || state.visit.stage === 'complete')
    return (
      <Shell title="Pantauan keluarga" subtitle="AKSES PENDAMPING" back="/akun">
        <Notice tone="warning">Pratinjau akses tidak aktif atau telah dicabut.</Notice>
        <ActionLink href="/pendamping" secondary>
          Kelola akses demo
        </ActionLink>
      </Shell>
    );
  const stage = state.visit.stage;
  return (
    <Shell title="Pantauan keluarga" subtitle="AKSES PENDAMPING" back="/pendamping">
      <Notice tone="info">Akses terbatas · Hanya pantauan · Demo lokal</Notice>
      <p className="eyebrow">KUNJUNGAN KELUARGA</p>
      <h2>Siti A.</h2>
      <section className="hero">
        <p className="eyebrow">
          {stage === 'booked'
            ? 'BELUM CHECK-IN'
            : stage === 'pharmacy'
              ? 'FARMASI'
              : stage === 'laboratory'
                ? 'LABORATORIUM'
                : 'MENUNGGU GILIRAN'}
        </p>
        <div className="ticket-number">{state.visit.ticket}</div>
        <h3>
          {stage === 'booked'
            ? 'Menunggu kedatangan'
            : stage === 'waiting'
              ? '3 pasien lagi · 15–25 menit'
              : stage === 'laboratory'
                ? 'Antrean laboratorium · 10–20 menit'
                : 'Obat disiapkan · 15–25 menit'}
        </h3>
        <p className="small">Data contoh, bukan pembaruan langsung.</p>
      </section>
      <section className="card">
        <p className="eyebrow">LOKASI SAAT INI</p>
        <h2>
          {stage === 'pharmacy'
            ? 'Loket F2'
            : stage === 'laboratory'
              ? 'Ruang A-108'
              : 'Ruang A-204'}
        </h2>
        <p className="muted">Gedung A · RS Harapan Sehat</p>
      </section>
      <Notice>
        Kontak pasien belum dikonfigurasi. Tidak ada panggilan atau pesan yang dikirim dari demo.
      </Notice>
      <p className="small muted">
        Hanya pantauan. Antrean tidak dapat diubah; informasi medis tetap privat. Masa berlaku
        produksi belum diterapkan.
      </p>
      <button
        className="text-button"
        onClick={() => dispatch({ type: 'companion', enabled: false })}
      >
        Berhenti memantau
      </button>
    </Shell>
  );
}

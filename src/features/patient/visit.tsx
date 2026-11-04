'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Shell, HyaHelp } from '@/components/shell';
import { ActionLink, Icon, Notice, RowLink, Steps } from '@/components/ui';
import { useDemo } from '@/features/demo/demo-provider';

export function Visit() {
  const { state, dispatch } = useDemo();
  const visit = state.visit;
  if (!visit) return <Shell title="Kunjungan" subtitle="RAWAT JALAN"><section className="card empty"><h2>Belum ada kunjungan aktif</h2><p className="muted">Pilih poliklinik dan jadwal dokter untuk memulai.</p><ActionLink href="/poliklinik">Ambil antrean</ActionLink></section><HyaHelp /></Shell>;
  if (visit.stage === 'waiting') return <Queue />;
  if (visit.stage === 'laboratory') return <NextService />;
  if (visit.stage === 'pharmacy') return <Pharmacy />;
  if (visit.stage === 'complete') return <Shell title="Kunjungan selesai"><Notice>Kunjungan demo selesai. Akses pendamping telah berakhir.</Notice><section className="card empty"><h2>Terima kasih.</h2><p>Semoga lekas sehat, Siti Aminah.</p><ActionLink href="/poliklinik">Mulai kunjungan baru</ActionLink></section></Shell>;
  return <Shell title="Tiket kunjungan" subtitle="RABU, 4 NOVEMBER 2026" back="/">
    <Notice>✓ Antrean berhasil diambil · Demo</Notice>
    <section className="card ticket-card"><p className="eyebrow">NOMOR ANTREAN ANDA</p><div className="ticket-number">A-027</div><h3>Siti Aminah</h3><hr /><h3>{visit.clinic}</h3><p className="muted">{visit.doctor}<br />Hari ini · {visit.time}</p></section>
    <section className="warning-card"><h2 style={{ fontSize: 22 }}>Berangkat sekarang</h2><p>Perjalanan ±25 menit. Check-in paling lambat 08.45.</p></section>
    <div className="metrics"><div><strong>12 pasien</strong><small>di depan Anda</small></div><div><strong>35–50 mnt</strong><small>setelah check-in</small></div></div>
    <ActionLink href="/check-in">Tampilkan QR check-in</ActionLink><p className="small muted">Gedung A, lantai 2 · Meja check-in<br />Waktu dan estimasi adalah contoh desain, bukan jadwal hari ini.</p><HyaHelp />
    <fieldset className="demo-controls"><legend>Kontrol demo</legend><button className="text-button" onClick={() => dispatch({ type: 'reset' })}>Batalkan dan reset kunjungan demo</button></fieldset>
  </Shell>;
}
export function CheckIn() {
  const { state, dispatch } = useDemo();
  const [manual, setManual] = useState(false);
  if (!state.visit) return <Visit />;
  return <Shell title="Check-in kedatangan" subtitle="RS HARAPAN SEHAT" back="/kunjungan"><h2>Tunjukkan QR ini<br />kepada petugas</h2><p className="muted">Meja check-in · Gedung A, lantai 2</p><section className="card qr-card"><h3>A-027 · Siti Aminah</h3><Image className="qr-example" src="/assets/qr-example.svg" width={232} height={232} alt="QR contoh kunjungan, tidak valid untuk check-in rumah sakit" /><p className="small muted">HT-842027 · QR contoh</p></section>
    <Notice tone={state.visit.stage === 'booked' ? 'warning' : 'green'}>{state.visit.stage === 'booked' ? 'Belum check-in · Batas contoh 08.45' : 'Sudah check-in · Simulasi'}</Notice>
    <ol className="plain-list"><li>Naik ke lantai 2 melalui lift Gedung A.</li><li>Tunjukkan QR ke petugas check-in.</li><li>Status berubah setelah QR dipindai.</li></ol><p className="muted">QR sulit dipindai? Gunakan nomor manual atau minta bantuan petugas.</p>
    <button className="button secondary" aria-expanded={manual} onClick={() => setManual(!manual)}>Nomor check-in manual</button>{manual && <Notice>Nomor contoh: HT-842027. Tunjukkan kepada petugas; tidak berlaku di rumah sakit.</Notice>}
    {state.visit.stage === 'booked' ? <fieldset className="demo-controls"><legend>Simulasi frontend · bukan pemindaian QR</legend><button className="button" onClick={() => dispatch({ type: 'advance', stage: 'waiting' })}>Simulasikan konfirmasi petugas</button></fieldset> : <ActionLink href="/kunjungan">Lihat antrean saya</ActionLink>}
  </Shell>;
}
export function Queue() {
  const { dispatch } = useDemo();
  return <Shell title="Antrean saya" subtitle="RAWAT JALAN · HARI INI" queue>
    <div className="connection-row"><strong>● Data demo lokal</strong><span>Contoh pukul 09.10</span></div>
    <section className="hero queue-hero"><p className="eyebrow">SUDAH CHECK-IN · 08.42</p><h2>Menunggu giliran</h2><div className="ticket-number">A-027</div><p className="ahead">3 pasien lagi sebelum Anda</p><hr /><div className="metrics"><div><strong>15–25 mnt</strong><small>perkiraan tunggu</small></div><div><strong>A-023</strong><small>sedang dilayani</small></div></div></section>
    <section className="queue-location"><p className="eyebrow">TUNGGU DI SINI</p><h2>Poli Penyakit Dalam</h2><p className="muted">Ruang A-204 · Gedung A, lantai 2</p><ActionLink href="/petunjuk-ruangan" secondary>Lihat petunjuk ruangan <Icon name="arrow" /></ActionLink></section>
    <p className="muted queue-reminder">Tetap di dekat ruang. Dengarkan juga<br />panggilan petugas rumah sakit.</p><div className="queue-share"><RowLink href="/pendamping">Bagikan ke pendamping</RowLink></div><HyaHelp />
    <fieldset className="demo-controls"><legend>Kontrol demo · di luar tampilan Figma</legend><button className="button secondary" onClick={() => dispatch({ type: 'advance', stage: 'laboratory' })}>Simulasikan pemeriksaan selesai</button></fieldset>
  </Shell>;
}
export function NextService() {
  const { dispatch } = useDemo();
  return <Shell title="Layanan berikutnya" subtitle="KUNJUNGAN A-027" back="/kunjungan"><Notice>✓ Pemeriksaan dokter selesai · Contoh 09.32</Notice><h2>Selanjutnya, ke<br />laboratorium</h2><section className="hero"><p className="eyebrow">GEDUNG A</p><div className="profile-row"><strong style={{ fontSize: 58 }}>L1</strong><span style={{ fontSize: 56 }} aria-label="Turun">↓</span></div><h3>Laboratorium · A-108</h3><p>Turun 1 lantai · ±3 menit berjalan</p></section><Steps items={[{ title: 'Gunakan lift di sebelah kanan', detail: 'Dari ruang A-204, ikuti tanda lift.' }, { title: 'Turun ke lantai 1', detail: 'Keluar lift, lalu belok kiri.' }, { title: 'Lapor di meja laboratorium', detail: 'Tunjukkan tiket A-027.' }]} /><section><h3>Perkiraan antrean 10–20 menit</h3><p className="muted small">Dimulai setelah lapor di laboratorium. Permintaan pemeriksaan pada demo tidak benar-benar dikirim.</p></section><ActionLink href="/petunjuk-ruangan" secondary>Lihat denah & rute aksesibel</ActionLink><fieldset className="demo-controls"><legend>Simulasi frontend</legend><button className="button" onClick={() => dispatch({ type: 'advance', stage: 'pharmacy' })}>Simulasikan lanjut ke farmasi</button></fieldset></Shell>;
}
export function Pharmacy() {
  const { dispatch } = useDemo();
  const [ready, setReady] = useState(false);
  return <Shell title="Status obat" subtitle="FARMASI RAWAT JALAN" back="/kunjungan"><Notice>● Data demo farmasi · 10.15</Notice><section className="hero"><p className="eyebrow">{ready ? 'OBAT SIAP DIAMBIL' : 'OBAT SEDANG DISIAPKAN'}</p><h2>{ready ? 'Silakan ke loket F2' : '15–25 menit'}</h2><p>{ready ? 'Tunjukkan nomor pengambilan Anda.' : 'Perkiraan siap 10.30–10.40'}</p><hr /><div className="profile-row"><strong style={{ fontSize: 38 }}>F-018</strong><p className="small">Nomor<br />pengambilan</p></div></section><Steps items={[{ title: 'Resep diterima', detail: '10.05 · Resep dari dokter diterima.' }, { title: 'Obat disiapkan', detail: 'Sedang dikerjakan petugas farmasi.' }, { title: 'Pemeriksaan akhir', detail: 'Obat diperiksa apoteker.' }, { title: 'Siap diambil', detail: ready ? 'Nomor F-018 dipanggil · Simulasi.' : 'Tunggu pemberitahuan sebelum ke loket.' }]} /><section className="info-card"><h3>{ready ? 'Ambil obat di Farmasi' : 'Tunggu di area Farmasi'}</h3><p>Gedung A, lantai 1 · Loket F2<br />Ambil obat setelah nomor F-018 dipanggil.</p></section><p className="small muted">Perkiraan berubah jika ada obat racikan. Petugas akan memberi tahu bila ada kendala.</p><fieldset className="demo-controls"><legend>Simulasi frontend</legend>{!ready ? <button className="button secondary" onClick={() => setReady(true)}>Simulasikan obat siap</button> : <button className="button" onClick={() => dispatch({ type: 'advance', stage: 'complete' })}>Simulasikan pengambilan selesai</button>}</fieldset></Shell>;
}

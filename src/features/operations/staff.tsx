'use client';
import { useState } from 'react';
import { DashboardShell } from './dashboard-shell';
import { queuePatients, type QueuePatient } from './data';
import { ActionLink, Notice } from '@/components/ui';
export function Staff() {
  const [section, setSection] = useState('Antrean poli');
  const [clinic, setClinic] = useState('Penyakit Dalam');
  const [doctor, setDoctor] = useState('dr. Rina Kusuma, Sp.PD');
  const [queue, setQueue] = useState(queuePatients);
  const [current, setCurrent] = useState<QueuePatient | null>({
    number: 'A-023',
    name: 'Hendra Wijaya',
    checkIn: '08.25',
  });
  const [repeated, setRepeated] = useState(false);
  const [completed, setCompleted] = useState(19);
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState<string | null>(null);
  const [history, setHistory] = useState(['08.42 · A-027 check-in oleh Meja A']);
  const filtered = queue.filter((patient) =>
    `${patient.name} ${patient.number}`.toLowerCase().includes(query.toLowerCase()),
  );
  const available = clinic === 'Penyakit Dalam' && doctor === 'dr. Rina Kusuma, Sp.PD';
  function log(message: string) {
    setHistory((items) => [`Simulasi · ${message}`, ...items]);
  }
  function callNext() {
    if (current || !queue.length) return;
    setCurrent(queue[0]);
    setQueue((items) => items.slice(1));
    setRepeated(false);
    log(`${queue[0].number} dipanggil`);
  }
  return (
    <DashboardShell section={section} onSection={setSection}>
      <div className="dashboard-title">
        <div>
          <h1>{section}</h1>
          <p className="muted">Kelola panggilan dan bantu pasien melanjutkan pelayanan.</p>
        </div>
        <Notice>Data contoh · 09.10</Notice>
      </div>
      {section === 'Antrean poli' ? (
        <>
          <div className="dashboard-filters">
            <label>
              <span className="sr-only">Poliklinik</span>
              <select value={clinic} onChange={(e) => setClinic(e.target.value)}>
                {['Penyakit Dalam', 'Jantung', 'Anak', 'Saraf'].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Dokter</span>
              <select value={doctor} onChange={(e) => setDoctor(e.target.value)}>
                <option>dr. Rina Kusuma, Sp.PD</option>
                <option>dr. Budi Santoso, Sp.PD</option>
              </select>
            </label>
            <p className="muted small">Ruang A-204 · 09.00–12.00</p>
          </div>
          {!available ? (
            <section className="card empty">
              <h2>Tidak ada data antrean contoh</h2>
              <p className="muted">
                Pilih Penyakit Dalam dan dr. Rina untuk melihat contoh dari Figma.
              </p>
            </section>
          ) : (
            <>
              <div className="stat-grid three">
                <Stat
                  label="Menunggu"
                  value={String(queue.length)}
                  detail="Baris contoh tersedia"
                />
                <Stat
                  label="Selesai"
                  value={String(completed)}
                  detail="Data awal contoh 19 pasien"
                />
                <Stat label="Belum check-in" value="4" detail="Periksa kedatangan pasien" />
              </div>
              <div className="staff-columns">
                <section className="card queue-table">
                  <div className="table-header">
                    <h3>Daftar antrean</h3>
                    <label>
                      <span className="sr-only">Cari pasien</span>
                      <input
                        placeholder="Cari pasien"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Nomor</th>
                          <th>Pasien</th>
                          <th>Check-in</th>
                          <th>Status</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((patient, index) => (
                          <tr key={patient.number} className={index === 0 ? 'next-row' : ''}>
                            <td>
                              <strong>{patient.number}</strong>
                            </td>
                            <td>{patient.name}</td>
                            <td>{patient.checkIn}</td>
                            <td>{index === 0 ? 'Berikutnya' : 'Menunggu'}</td>
                            <td>
                              <button
                                className="text-button"
                                onClick={() =>
                                  setDetail(detail === patient.number ? null : patient.number)
                                }
                                aria-expanded={detail === patient.number}
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {!filtered.length && (
                    <p className="empty" role="status">
                      Tidak ada pasien yang cocok.
                    </p>
                  )}
                  {detail && (
                    <Notice>
                      Nomor {detail} · Data kunjungan contoh. Tidak ada diagnosis atau rekam medis
                      pada frontend.
                    </Notice>
                  )}
                  <div className="table-footer">
                    <span>
                      Menampilkan {filtered.length} dari {queue.length} baris contoh
                    </span>
                    <span>Halaman 1 dari 1</span>
                  </div>
                </section>
                <div className="stack">
                  <section className="hero">
                    <p className="eyebrow">SEDANG DILAYANI</p>
                    <h2 style={{ fontSize: 44 }}>{current?.number ?? '—'}</h2>
                    <h3>{current?.name ?? 'Belum ada pasien'}</h3>
                    <p className="small">
                      {current ? 'Mulai 09.02 · Waktu contoh' : 'Panggil pasien berikutnya'}
                    </p>
                    <button
                      className="button white"
                      disabled={!current}
                      onClick={() => {
                        log(`${current!.number} selesai, lanjut layanan`);
                        setCurrent(null);
                        setRepeated(false);
                        setCompleted((value) => value + 1);
                      }}
                    >
                      Selesai & lanjutkan layanan
                    </button>
                  </section>
                  <section className="card stack">
                    <h3>Berikutnya {queue[0]?.number ?? '—'}</h3>
                    <p className="muted small">
                      Selesaikan pasien aktif sebelum memanggil berikutnya.
                    </p>
                    <button
                      className="button"
                      disabled={!!current || !queue.length}
                      onClick={callNext}
                    >
                      Panggil pasien berikutnya
                    </button>
                    <div className="split-actions">
                      <button
                        className="button secondary"
                        disabled={!current}
                        onClick={() => {
                          setRepeated(true);
                          log(`${current!.number} dipanggil ulang`);
                        }}
                      >
                        Panggil ulang
                      </button>
                      <button
                        className="button secondary"
                        disabled={!current || !repeated}
                        onClick={() => {
                          log(`${current!.number} tidak hadir setelah panggilan ulang`);
                          setCurrent(null);
                          setRepeated(false);
                        }}
                      >
                        Tidak hadir
                      </button>
                    </div>
                  </section>
                  <Notice tone="warning">
                    Perubahan status tercatat lokal. Tandai tidak hadir hanya setelah panggilan
                    ulang.
                  </Notice>
                </div>
              </div>
              <div className="dashboard-footnote" role="status">
                {history[0]}
              </div>
            </>
          )}
        </>
      ) : section === 'Riwayat aktivitas' ? (
        <section className="card stack">
          <h2>Riwayat aktivitas demo</h2>
          {history.map((item, index) => (
            <p key={`${index}-${item}`}>{item}</p>
          ))}
          <p className="muted small">
            Bukan audit log produksi; riwayat hilang saat halaman dimuat ulang.
          </p>
        </section>
      ) : (
        <section className="card stack">
          <h2>{section === 'Farmasi' ? 'Pantau penyiapan obat' : 'Lanjutkan alur pelayanan'}</h2>
          <p className="muted">
            Backend petugas belum terhubung. Coba alur pasien pada sesi demo tanpa mengirim
            instruksi medis.
          </p>
          <ActionLink href="/kunjungan" secondary>
            Buka kunjungan demo
          </ActionLink>
        </section>
      )}
    </DashboardShell>
  );
}
export function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <section className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{detail}</small>
    </section>
  );
}

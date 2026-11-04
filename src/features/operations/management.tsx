'use client';
import { useState } from 'react';
import { DashboardShell } from './dashboard-shell';
import { Stat } from './staff';
import { clinicPerformance, hourlyWait, reportCsv } from './data';
import { Notice } from '@/components/ui';
export function Management() {
  const [section, setSection] = useState('Ringkasan layanan');
  const [clinic, setClinic] = useState('Semua poliklinik');
  const [date, setDate] = useState('4 Nov 2026');
  const [status, setStatus] = useState('');
  const rows = clinicPerformance.filter(
    (row) => clinic === 'Semua poliklinik' || row.clinic === clinic,
  );
  const selected = clinicPerformance.find((row) => row.clinic === clinic);
  function exportReport() {
    const blob = new Blob([reportCsv(clinic)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'hytrack-laporan-contoh-2026-11-04.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus('Laporan data contoh diunduh dalam format CSV.');
  }
  return (
    <DashboardShell management section={section} onSection={setSection}>
      <div className="dashboard-title">
        <div>
          <h1>{section}</h1>
          <p className="muted">
            Dari kedatangan hingga obat: lihat di mana pasien paling lama menunggu.
          </p>
        </div>
        <Notice>Data contoh</Notice>
      </div>
      <div className="dashboard-filters">
        <label>
          <span className="sr-only">Tanggal laporan</span>
          <select value={date} onChange={(e) => setDate(e.target.value)}>
            <option>4 Nov 2026</option>
            <option>3 Nov 2026</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Filter poliklinik</span>
          <select value={clinic} onChange={(e) => setClinic(e.target.value)}>
            <option>Semua poliklinik</option>
            {clinicPerformance.map((row) => (
              <option key={row.clinic}>{row.clinic}</option>
            ))}
          </select>
        </label>
        <button className="button" disabled={date !== '4 Nov 2026'} onClick={exportReport}>
          ↓ Ekspor laporan
        </button>
      </div>
      {date !== '4 Nov 2026' ? (
        <section className="card empty">
          <h2>Belum ada data contoh</h2>
          <p className="muted">
            Desain menyediakan laporan 4 November 2026. Pilih tanggal tersebut untuk melanjutkan.
          </p>
        </section>
      ) : (
        <>
          <div className="stat-grid four">
            <Stat
              label={selected ? 'Pasien selesai' : 'Pasien terdaftar'}
              value={selected ? String(selected.complete) : '648'}
              detail={selected ? selected.clinic : '526 selesai · 82 aktif · 40 belum tiba'}
            />
            <Stat
              label="Rata-rata tunggu"
              value={`${selected?.wait ?? 36} mnt`}
              detail="Target layanan 30 menit"
            />
            <Stat
              label="Sesuai target tunggu"
              value={selected ? '—' : '74%'}
              detail={
                selected ? 'Rincian persentase tidak tersedia' : 'Target layanan: minimal 85%'
              }
            />
            <Stat
              label="Check-in tepat waktu"
              value={selected ? '—' : '91%'}
              detail="Dari pasien yang sudah tiba"
            />
          </div>
          {(section === 'Ringkasan layanan' || section === 'Waktu tunggu') && (
            <div className="management-columns">
              <section className="card">
                <div className="table-header">
                  <h3>Waktu tunggu per jam</h3>
                  <small className="muted">Menit · Check-in → dokter</small>
                </div>
                {selected ? (
                  <Notice tone="info">
                    Rincian per jam untuk {clinic} tidak tersedia pada desain. Grafik berikut adalah
                    agregat semua poliklinik.
                  </Notice>
                ) : null}
                <figure
                  className="wait-chart"
                  aria-label="Waktu tunggu agregat per jam dalam menit"
                >
                  <div className="chart-grid">
                    <span>60</span>
                    <span>30</span>
                    <span>0</span>
                  </div>
                  <div className="chart-bars">
                    {hourlyWait.map((row) => (
                      <div className="chart-column" key={row.hour}>
                        <span>{row.wait}</span>
                        <div
                          className={`chart-bar ${row.wait > 30 ? 'above' : ''}`}
                          style={{ height: `${(row.wait / 60) * 160}px` }}
                        />
                        <small>{row.hour}</small>
                      </div>
                    ))}
                  </div>
                  <figcaption>
                    <span>■ ≤30 menit</span>
                    <span>■ &gt;30 menit</span>
                    <span>Target 30 menit</span>
                  </figcaption>
                </figure>
                <details>
                  <summary>Lihat data grafik</summary>
                  <table>
                    <thead>
                      <tr>
                        <th>Jam</th>
                        <th>Menit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hourlyWait.map((row) => (
                        <tr key={row.hour}>
                          <td>{row.hour}</td>
                          <td>{row.wait}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              </section>
              <section className="warning-card attention">
                <p className="eyebrow">PERLU PERHATIAN</p>
                <h3>{selected?.clinic ?? 'Penyakit Dalam'}</h3>
                <strong>{selected?.wait ?? 48} menit</strong>
                <p>Rata-rata tunggu pada data contoh. Target layanan 30 menit.</p>
                <hr />
                <p>Tinjau kapasitas layanan sebelum menambah kuota.</p>
              </section>
            </div>
          )}
          {(section === 'Ringkasan layanan' ||
            section === 'Kinerja poliklinik' ||
            section === 'Laporan') && (
            <div className="management-columns">
              <section className="card">
                <h3>Kinerja poliklinik</h3>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Poliklinik</th>
                        <th>Selesai</th>
                        <th>Rata-rata tunggu</th>
                        <th>Target</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.clinic}>
                          <td>
                            <strong>{row.clinic}</strong>
                          </td>
                          <td>{row.complete}</td>
                          <td>{row.wait} menit</td>
                          <td className={row.wait > 30 ? 'warning-text' : 'primary-text'}>
                            {row.wait > 30 ? 'Di atas' : 'Sesuai'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              <section className="card stack">
                <h3>Tahap pelayanan</h3>
                {[
                  ['Check-in → dokter', '36 mnt'],
                  ['Dokter → laboratorium', '18 mnt'],
                  ['Resep → obat siap', '22 mnt'],
                ].map(([label, value]) => (
                  <div className="profile-row" key={label}>
                    <span className="muted">{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
                <p className="small muted">
                  Agregat semua poliklinik. Rata-rata tunggu antar tahap, bukan durasi tindakan
                  medis.
                </p>
              </section>
            </div>
          )}
          {section === 'Laporan' && (
            <Notice tone="info">
              Ekspor berisi data agregat contoh yang sedang difilter. Tidak memuat identitas pasien.
            </Notice>
          )}
          <p className="status-line" role="status">
            {status}
          </p>
          <p className="dashboard-footnote">
            Definisi: waktu tunggu dokter dihitung sejak check-in hingga mulai dilayani. Tampilan
            manajemen tidak memuat identitas pasien.
          </p>
        </>
      )}
    </DashboardShell>
  );
}

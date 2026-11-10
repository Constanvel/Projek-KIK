'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/shell';
import { ActionLink, Icon, Notice, RowLink } from '@/components/ui';
import { clinics, doctors, scheduleDays } from '@/features/demo/model';
import { useDemo } from '@/features/demo/demo-provider';

export function Clinics() {
  const [query, setQuery] = useState('');
  const filtered = clinics.filter((clinic) =>
    clinic.name.toLowerCase().includes(query.toLowerCase().trim()),
  );
  return (
    <Shell title="Pilih poliklinik" subtitle="KUNJUNGAN BARU · 1 / 2" back="/" guide="poli">
      <h2>Mau berobat ke mana?</h2>
      <label className="search-field">
        <Icon name="search" />
        <input
          aria-label="Cari nama poliklinik"
          placeholder="Cari nama poliklinik"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <Notice>RS Harapan Sehat · Rawat jalan</Notice>
      <h3>Poliklinik tersedia hari ini</h3>
      <div className="clinic-list" data-guide="">
        {filtered.map((clinic) => (
          <RowLink
            key={clinic.name}
            href={`/dokter?poli=${encodeURIComponent(clinic.name)}`}
            detail={`${clinic.doctors} dokter praktik · ${clinic.wait}`}
          >
            {clinic.name}
          </RowLink>
        ))}
      </div>
      {!filtered.length && (
        <div className="card empty" role="status">
          <h3>Poliklinik tidak ditemukan</h3>
          <p className="muted">Coba kata pencarian lain.</p>
          <button className="text-button" onClick={() => setQuery('')}>
            Hapus pencarian
          </button>
        </div>
      )}
      <p className="small muted">
        Perkiraan tunggu berubah mengikuti pelayanan. Ketersediaan di atas adalah data contoh.
      </p>
    </Shell>
  );
}
export function DoctorSchedule({ clinic }: { clinic: string }) {
  const [date, setDate] = useState('4 Nov');
  const [doctorIndex, setDoctorIndex] = useState(0);
  const { state, dispatch } = useDemo();
  const router = useRouter();
  const isInternal = clinic === 'Penyakit Dalam';
  const doctor = doctors[doctorIndex];
  if (state.visit && state.visit.stage !== 'complete')
    return (
      <Shell title="Dokter & jadwal" back="/poliklinik">
        <Notice tone="warning">Anda sudah memiliki satu kunjungan aktif.</Notice>
        <ActionLink href="/kunjungan">Buka kunjungan aktif</ActionLink>
      </Shell>
    );
  return (
    <Shell
      title="Dokter & jadwal"
      subtitle="KUNJUNGAN BARU · 2 / 2"
      back="/poliklinik"
      guide={isInternal ? 'dokter' : undefined}
    >
      <Notice>
        {clinic}
        {isInternal ? ' · Gedung A, lantai 2' : ' · Jadwal belum tersedia pada desain'}
      </Notice>
      <h2>Pilih dokter & jadwal</h2>
      {!isInternal ? (
        <section className="card empty">
          <h3>Jadwal belum tersedia</h3>
          <p className="muted">
            Desain hanya menyediakan contoh dokter Penyakit Dalam. Jadwal poli lain tidak
            dibuat-buat.
          </p>
          <ActionLink href="/dokter?poli=Penyakit%20Dalam" secondary>
            Lihat contoh Penyakit Dalam
          </ActionLink>
        </section>
      ) : (
        <>
          <div className="date-grid" role="group" aria-label="Tanggal kunjungan">
            {scheduleDays.map(({ key, day }) => (
              <button key={key} aria-pressed={date === key} onClick={() => setDate(key)}>
                {day}
                <strong>{key}</strong>
              </button>
            ))}
          </div>
          {date !== '4 Nov' ? (
            <section className="card empty" role="status">
              <h3>Belum ada jadwal contoh</h3>
              <p className="muted">Pilih 4 Nov untuk mencoba alur sesuai Figma.</p>
            </section>
          ) : (
            <div className="stack" role="group" aria-label="Pilih dokter">
              {doctors.map((item, index) => (
                <button
                  className="doctor-option"
                  aria-pressed={doctorIndex === index}
                  key={item.name}
                  onClick={() => setDoctorIndex(index)}
                >
                  <strong>
                    {item.name}
                    {doctorIndex === index && <Icon name="check" />}
                  </strong>
                  <p className="muted">
                    {doctorIndex === index && (
                      <>
                        Penyakit Dalam
                        <br />
                      </>
                    )}
                    Rabu, 4 Nov · {item.time}
                  </p>
                  {doctorIndex === index && (
                    <>
                      <hr />
                      <div className="metrics">
                        <span>
                          <small>Perkiraan tunggu</small>
                          <strong>35–50 menit</strong>
                        </span>
                        <span>
                          <small>Sisa kuota</small>
                          <strong>{item.quota} pasien</strong>
                        </span>
                      </div>
                      <Notice>Jadwal dipilih · {item.time}</Notice>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
          <section className="warning-card">
            <strong>Antrean belum diambil</strong>
            <p className="small">
              Nomor diterbitkan setelah Anda menekan Ambil antrean. Maks. 1 kunjungan aktif.
            </p>
          </section>
          <button
            className="button"
            data-guide=""
            disabled={date !== '4 Nov'}
            onClick={() => {
              dispatch({
                type: 'book',
                visit: {
                  clinic,
                  doctor: doctor.name,
                  date,
                  time: doctor.time,
                  ticket: doctor.ticket,
                },
              });
              router.push('/kunjungan');
            }}
          >
            Ambil antrean <Icon name="arrow" className="on-dark" />
          </button>
        </>
      )}
    </Shell>
  );
}

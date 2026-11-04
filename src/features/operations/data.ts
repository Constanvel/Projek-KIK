export interface QueuePatient { number: string; name: string; checkIn: string }
export const queuePatients: QueuePatient[] = [
  { number: 'A-024', name: 'Agus Setiawan', checkIn: '08.30' },
  { number: 'A-025', name: 'Rudi Hartono', checkIn: '08.34' },
  { number: 'A-026', name: 'Ratna Sari', checkIn: '08.38' },
  { number: 'A-027', name: 'Siti Aminah', checkIn: '08.42' },
  { number: 'A-028', name: 'Eko Prasetyo', checkIn: '08.44' },
  { number: 'A-029', name: 'Dewi Lestari', checkIn: '08.45' },
];
export const clinicPerformance = [
  { clinic: 'Penyakit Dalam', complete: 184, wait: 48 },
  { clinic: 'Jantung', complete: 126, wait: 34 },
  { clinic: 'Anak', complete: 112, wait: 24 },
  { clinic: 'Saraf', complete: 104, wait: 28 },
];
export const hourlyWait = [18, 24, 32, 48, 42, 35, 28, 21, 17].map((wait, index) => ({ hour: `${String(index + 7).padStart(2, '0')}.00`, wait }));
export function reportCsv(clinic: string) {
  const rows = clinicPerformance.filter(row => clinic === 'Semua poliklinik' || row.clinic === clinic);
  return '\uFEFFData contoh HyTrack - bukan laporan produksi\r\nPoliklinik,Selesai,Rata-rata tunggu (menit),Target 30 menit\r\n' + rows.map(row => `${row.clinic},${row.complete},${row.wait},${row.wait <= 30 ? 'Sesuai' : 'Di atas'}`).join('\r\n');
}

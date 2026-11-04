export type VisitStage = 'booked' | 'waiting' | 'laboratory' | 'pharmacy' | 'complete';
export interface DemoVisit { clinic: string; doctor: string; date: string; time: string; stage: VisitStage }
export interface DemoState { visit: DemoVisit | null; companion: boolean }
export const initialState: DemoState = { visit: null, companion: false };
export type DemoAction = { type: 'book'; visit: Omit<DemoVisit, 'stage'> } | { type: 'advance'; stage: VisitStage } | { type: 'companion'; enabled: boolean } | { type: 'reset' };
const transitions: Record<VisitStage, VisitStage[]> = { booked: ['waiting'], waiting: ['laboratory'], laboratory: ['pharmacy'], pharmacy: ['complete'], complete: [] };
export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'book': return state.visit && state.visit.stage !== 'complete' ? state : { visit: { ...action.visit, stage: 'booked' }, companion: false };
    case 'advance': return state.visit && transitions[state.visit.stage].includes(action.stage) ? { ...state, visit: { ...state.visit, stage: action.stage }, companion: action.stage === 'complete' ? false : state.companion } : state;
    case 'companion': return { ...state, companion: !!state.visit && state.visit.stage !== 'complete' && action.enabled };
    case 'reset': return initialState;
  }
}
export const clinics = [
  { name: 'Penyakit Dalam', doctors: 3, wait: '35–50 menit' },
  { name: 'Jantung', doctors: 2, wait: '25–40 menit' },
  { name: 'Anak', doctors: 3, wait: '20–35 menit' },
  { name: 'Saraf', doctors: 1, wait: '40–60 menit' },
];
export const doctors = [
  { name: 'dr. Rina Kusuma, Sp.PD', time: '09.00–12.00', quota: 18 },
  { name: 'dr. Budi Santoso, Sp.PD', time: '13.00–16.00', quota: 25 },
];
export function hyaReply(question: string, stage?: VisitStage): string {
  if (/medis|sakit|obat|diagnos|resep|dosis/i.test(question)) return 'Untuk keluhan atau pertanyaan medis, silakan hubungi tenaga kesehatan. Hya hanya membantu informasi layanan rumah sakit.';
  if (/check|qr|terlambat/i.test(question)) return 'Buka tiket kunjungan, lalu tekan “Tampilkan QR check-in”. Tunjukkan QR kepada petugas di meja check-in. Jika terlambat, minta bantuan petugas. QR pada demo ini tidak valid.';
  if (!stage || stage === 'complete') return 'Belum ada kunjungan aktif. Mulai dari Beranda untuk memilih poliklinik dan jadwal dokter. Ini respons terstruktur, bukan layanan AI.';
  if (/ruang|mana|lokasi|arah/i.test(question)) return stage === 'pharmacy' ? 'Tunggu di area Farmasi, Gedung A lantai 1, Loket F2. Lokasi ini merupakan contoh dari desain.' : 'Tempat menunggu pada contoh desain: Ruang A-204, Gedung A, lantai 2. Ikuti petunjuk rumah sakit dan arahan petugas.';
  if (/giliran|antre|tunggu|kapan/i.test(question)) return stage === 'booked' ? 'Anda belum check-in. Tunjukkan QR contoh di halaman tiket untuk mencoba simulasi kedatangan.' : 'Pada data demo, ada 3 pasien di depan Anda. Perkiraan menunggu 15–25 menit. Estimasi dapat berubah mengikuti pelayanan; demo ini tidak terhubung langsung.';
  return 'Hya dapat membantu informasi antrean, lokasi layanan, dan cara check-in. Pilih topik tersebut atau hubungi petugas rumah sakit untuk bantuan lain.';
}

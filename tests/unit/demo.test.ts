import { describe, it, expect } from 'vitest';
import {
  checkInCode,
  dateLabel,
  demoReducer,
  departure,
  doctors,
  hyaReply,
  initialState,
  servingNumber,
} from '../../src/features/demo/model';
import { reportCsv } from '../../src/features/operations/data';
const visit = {
  clinic: 'Penyakit Dalam',
  doctor: 'dr. Rina Kusuma, Sp.PD',
  date: '4 Nov',
  time: '09.00–12.00',
  ticket: 'A-027',
};
describe('demo visit transitions', () => {
  it('books a visit without permitting a second active visit', () => {
    const booked = demoReducer(initialState, { type: 'book', visit });
    expect(booked.visit?.stage).toBe('booked');
    expect(demoReducer(booked, { type: 'book', visit: { ...visit, clinic: 'Jantung' } })).toEqual(
      booked,
    );
  });
  it('rejects skipped transitions', () => {
    const booked = demoReducer(initialState, { type: 'book', visit });
    expect(demoReducer(booked, { type: 'advance', stage: 'pharmacy' })).toEqual(booked);
  });
  it('advances through the visit and revokes companion preview on completion', () => {
    let state = demoReducer(initialState, { type: 'book', visit });
    state = demoReducer(state, { type: 'companion', enabled: true });
    expect(state.companion).toBe(true);
    for (const stage of ['waiting', 'laboratory', 'pharmacy', 'complete'] as const)
      state = demoReducer(state, { type: 'advance', stage });
    expect(state.visit?.stage).toBe('complete');
    expect(state.companion).toBe(false);
    expect(demoReducer(state, { type: 'companion', enabled: true }).companion).toBe(false);
    expect(demoReducer(state, { type: 'book', visit }).visit?.stage).toBe('booked');
  });
  it('does not enable preview without a visit', () =>
    expect(demoReducer(initialState, { type: 'companion', enabled: true }).companion).toBe(false));
  it('resets local data', () =>
    expect(
      demoReducer(demoReducer(initialState, { type: 'book', visit }), { type: 'reset' }),
    ).toEqual(initialState));
});
describe('visit information derived from the chosen schedule', () => {
  it('computes departure from the doctor start time, matching the design for 09.00', () => {
    expect(departure('09.00–12.00')).toEqual({ checkInBy: '08.45', leaveBy: '08.20' });
    expect(departure('13.00–16.00')).toEqual({ checkInBy: '12.45', leaveBy: '12.20' });
  });
  it('labels dates and derives queue numbers from the ticket', () => {
    expect(dateLabel('4 Nov')).toBe('Rabu, 4 November 2026');
    expect(servingNumber('A-027')).toBe('A-023');
    expect(servingNumber('B-014')).toBe('B-010');
    expect(checkInCode('A-027')).toBe('HT-842027');
    expect(new Set(doctors.map((doctor) => doctor.ticket)).size).toBe(doctors.length);
  });
});
describe('structured help', () => {
  it('directs medical questions to professionals', () =>
    expect(hyaReply('Berapa dosis obat?')).toContain('tenaga kesehatan'));
  it('explains check-in without claiming valid QR', () =>
    expect(hyaReply('Cara check-in?', 'booked')).toContain('tidak valid'));
  it('does not invent an active queue', () =>
    expect(hyaReply('Kapan giliran saya?')).toContain('Belum ada kunjungan aktif'));
  it('labels queue data as demo', () =>
    expect(hyaReply('Kapan giliran saya?', 'waiting')).toContain('data demo'));
  it('uses the laboratory stage instead of the earlier queue', () =>
    expect(hyaReply('Kapan giliran saya?', 'laboratory')).toContain('10–20 menit'));
  it('uses the pharmacy stage for location and wait', () => {
    expect(hyaReply('Kapan giliran saya?', 'pharmacy')).toContain('F-018');
    expect(hyaReply('Ke ruangan mana?', 'pharmacy')).toContain('F2');
  });
});
describe('aggregate export', () => {
  it('labels example data and excludes patient identifiers', () => {
    const csv = reportCsv('Semua poliklinik');
    expect(csv).toContain('bukan laporan produksi');
    expect(csv).not.toContain('Siti');
    expect(csv).not.toContain('A-027');
  });
  it('exports only the selected clinic', () => {
    const csv = reportCsv('Jantung');
    expect(csv).toContain('Jantung,126,34');
    expect(csv).not.toContain('Penyakit Dalam');
  });
});

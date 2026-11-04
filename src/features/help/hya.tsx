'use client';
import Image from 'next/image';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Shell } from '@/components/shell';
import { Icon, Notice, RowLink } from '@/components/ui';
import { useDemo } from '@/features/demo/demo-provider';
import { hyaReply } from '@/features/demo/model';
interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}
export function Hya() {
  const { state } = useDemo();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const last = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages.length) last.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [messages]);
  function ask(question: string) {
    const value = question.trim().slice(0, 500);
    if (!value) return;
    setMessages((current) => [
      ...current,
      { id: current.length, role: 'user', text: value },
      { id: current.length + 1, role: 'assistant', text: hyaReply(value, state.visit?.stage) },
    ]);
    setInput('');
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    ask(input);
  }
  return (
    <Shell title="Hya" subtitle="Asisten digital HyTrack" back="/kunjungan" hya>
      {!messages.length ? (
        <>
          <p className="eyebrow" style={{ color: 'var(--primary)' }}>
            PANDUAN KUNJUNGAN ANDA
          </p>
          <Image
            className="hya-illustration"
            src="/assets/hya.png"
            width={400}
            height={300}
            alt="Hya, asisten layanan rumah sakit, melambaikan tangan"
            priority
          />
          <section className="intro">
            <h2>Halo, saya Hya.</h2>
            <p>
              Saya bantu Anda mengikuti antrean
              <br />
              dan menemukan layanan berikutnya.
            </p>
          </section>
          {state.visit && state.visit.stage !== 'complete' ? (
            <Notice>
              KUNJUNGAN AKTIF · A-027
              <br />
              <strong>
                {state.visit.stage === 'booked'
                  ? 'Belum check-in'
                  : state.visit.stage === 'waiting'
                    ? '3 pasien lagi'
                    : state.visit.stage === 'laboratory'
                      ? 'Layanan laboratorium'
                      : 'Penyiapan obat'}{' '}
                · Poli Penyakit Dalam
              </strong>
            </Notice>
          ) : (
            <Notice>
              Belum ada kunjungan aktif. Anda tetap bisa bertanya tentang panduan layanan.
            </Notice>
          )}
          <h3>Apa yang ingin Anda ketahui?</h3>
          <div className="stack">
            {[
              'Kapan giliran saya?',
              'Ke ruangan mana saya harus pergi?',
              'Bagaimana cara check-in?',
            ].map((question) => (
              <button key={question} className="suggestion" onClick={() => ask(question)}>
                {question}
                <Icon name="arrow" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <Notice>
            {state.visit ? 'A-027 · Poli Penyakit Dalam' : 'Panduan layanan'} · Data demo
          </Notice>
          <div className="messages" role="log" aria-live="polite" aria-label="Percakapan Hya">
            {messages.map((message) => (
              <div className={`message ${message.role}`} key={message.id}>
                {message.role === 'assistant' && <strong>Hya</strong>}
                <p>{message.text}</p>
              </div>
            ))}
          </div>
          <div ref={last}>
            <RowLink href="/petunjuk-ruangan">Buka petunjuk ruangan</RowLink>
          </div>
          <button className="suggestion" onClick={() => ask('Bagaimana jika saya terlambat?')}>
            Bagaimana jika saya terlambat?
          </button>
          <button className="text-button" onClick={() => setMessages([])}>
            Mulai percakapan baru
          </button>
        </>
      )}
      <Notice tone="warning">
        Untuk keluhan atau pertanyaan medis, silakan hubungi tenaga kesehatan.
      </Notice>
      <div className="chat-composer">
        <form onSubmit={submit}>
          <input
            aria-label="Pertanyaan untuk Hya"
            placeholder="Tulis pertanyaan Anda..."
            maxLength={500}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" aria-label="Kirim pertanyaan" disabled={!input.trim()}>
            <Icon name="send" />
          </button>
        </form>
        <small>Demo respons terstruktur, bukan AI. Jangan masukkan data pribadi atau medis.</small>
      </div>
    </Shell>
  );
}

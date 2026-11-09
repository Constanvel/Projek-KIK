'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, Avatar } from './ui';
import type { ReactNode } from 'react';
import { GuideHint, useGuide, type GuideStep } from '@/features/guide/guide';

export function Shell({
  title,
  subtitle,
  back,
  children,
  hya = false,
  queue = false,
  guide,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  children: ReactNode;
  hya?: boolean;
  queue?: boolean;
  guide?: GuideStep;
}) {
  const path = usePathname();
  const { visible: guiding } = useGuide(guide);
  const active =
    path === '/'
      ? 'home'
      : path.startsWith('/akun') || path.startsWith('/bantuan')
        ? 'user'
        : 'ticket';
  return (
    <div
      className={`app-shell ${hya ? 'chat-shell' : ''} ${queue ? 'queue-shell' : ''} ${guiding ? 'guide-active' : ''}`}
    >
      <div className="demo-banner">Demo frontend · Tidak terhubung ke rumah sakit</div>
      <header className="page-header">
        {back && (
          <Link className="icon-button back" href={back} aria-label="Kembali">
            <Icon name="back" />
          </Link>
        )}
        {hya && <Avatar />}
        <div className="heading">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {hya ? (
          <Link href="/kunjungan" className="icon-button close" aria-label="Tutup Hya">
            <Icon name="close" />
          </Link>
        ) : (
          !back && (
            <Link href="/notifikasi" className="icon-button" aria-label="Notifikasi">
              <Icon name="bell" />
            </Link>
          )
        )}
      </header>
      <main id="main" className="page-content">
        {guide && <GuideHint step={guide} />}
        {children}
      </main>
      {!hya && (
        <nav className="bottom-nav" aria-label="Navigasi utama">
          {[
            { href: '/', icon: 'home', label: 'Beranda' },
            { href: '/kunjungan', icon: 'ticket', label: 'Kunjungan' },
            { href: '/akun', icon: 'user', label: 'Akun' },
          ].map((item) => (
            <Link
              href={item.href}
              key={item.href}
              aria-current={active === item.icon ? 'page' : undefined}
            >
              <span className="nav-marker">
                <Icon name={item.icon} />
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
export function HyaHelp() {
  return (
    <Link href="/hya" className="hya-help">
      <span>
        <strong>Perlu bantuan layanan?</strong>
        <small>Tanya Hya lewat tombol di kanan.</small>
      </span>
      <Avatar large />
    </Link>
  );
}

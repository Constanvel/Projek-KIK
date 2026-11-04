import { notFound } from 'next/navigation';
import { Account } from '@/features/patient/home';
import { Clinics, DoctorSchedule } from '@/features/patient/booking';
import { CheckIn, Visit } from '@/features/patient/visit';
import { CompanionAccess, CompanionView } from '@/features/patient/companion';
import { CheckInGuide, Directions, Help, Notifications, QueueGuide } from '@/features/help/help';
import { Hya } from '@/features/help/hya';
import { Staff } from '@/features/operations/staff';
import { Management } from '@/features/operations/management';
import { clinics } from '@/features/demo/model';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const path = slug.join('/');
  switch (path) {
    case 'poliklinik':
      return <Clinics />;
    case 'dokter': {
      const { poli } = await searchParams;
      const clinic = clinics.find((item) => item.name === poli)?.name ?? 'Penyakit Dalam';
      return <DoctorSchedule clinic={clinic} />;
    }
    case 'kunjungan':
      return <Visit />;
    case 'check-in':
      return <CheckIn />;
    case 'pendamping':
      return <CompanionAccess />;
    case 'pantauan':
      return <CompanionView />;
    case 'akun':
      return <Account />;
    case 'hya':
      return <Hya />;
    case 'bantuan':
      return <Help />;
    case 'bantuan/check-in':
      return <CheckInGuide />;
    case 'bantuan/antrean':
      return <QueueGuide />;
    case 'petunjuk-ruangan':
      return <Directions />;
    case 'notifikasi':
      return <Notifications />;
    case 'petugas':
      return <Staff />;
    case 'manajemen':
      return <Management />;
    default:
      notFound();
  }
}

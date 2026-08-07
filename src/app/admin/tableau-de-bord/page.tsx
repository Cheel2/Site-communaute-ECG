import type { Metadata } from 'next';
import { getBanniere } from '@/features/banniere/actions';
import BanniereDashboardClient from './banniere-dashboard-client';

export const metadata: Metadata = {
  title: 'Tableau de bord — Bannière',
};

export default async function TableauDeBordPage() {
  const initialBanniere = await getBanniere();

  return <BanniereDashboardClient initialBanniere={initialBanniere} />;
}

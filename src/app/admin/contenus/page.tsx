import type { Metadata } from 'next';
import { listContenus } from '@/features/contenus/actions';
import { listRubriques } from '@/features/rubriques/actions';
import ContenusClient from './contenus-client';

export const metadata: Metadata = {
  title: 'Contenus — Administration',
};

export default async function ContenusPage() {
  const [contenus, rubriques] = await Promise.all([
    listContenus(),
    listRubriques(),
  ]);

  return <ContenusClient initialContenus={contenus} rubriques={rubriques} />;
}export default function Page() { return <div></div>; }

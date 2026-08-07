export default function Page() { return <div></div>; }
import type { Metadata } from 'next';
import { listRubriques } from '@/features/rubriques/actions';
import RubriquesClient from './rubriques-client';

export const metadata: Metadata = {
  title: 'Rubriques — Administration',
};

export default async function RubriquesPage() {
  const rubriques = await listRubriques();

  return <RubriquesClient initialRubriques={rubriques} />;
}
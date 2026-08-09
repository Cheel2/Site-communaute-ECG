// src/app/(public)/evenements/page.tsx
import { createAnonClient } from '@/lib/supabase/anon';
import { Evenement } from '@/types/database';
import { EvenementCard } from './evenement-card';
import { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Événements - Ministère Pastoral',
    description: 'Découvrez les événements récurrents et spéciaux de notre ministère pastoral.',
  };
}

export default async function EvenementsPage() {
  const supabase = createAnonClient();

  const { data: evenements, error: errorEvenements } = await supabase
    .from('evenement')
    .select('*')
    .eq('statut', 'publie')
    .order('date_debut', { ascending: false });

  const { data: parametreWA } = await supabase
    .from('parametre')
    .select('valeur')
    .eq('cle', 'whatsapp_numero')
    .single();

  if (errorEvenements) {
    console.error('Erreur lors du chargement des événements:', errorEvenements.message);
  }

  const listeEvenements = (evenements as Evenement[]) || [];
  const numeroWhatsApp = parametreWA?.valeur || '';

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Événements</h1>
      
      {listeEvenements.length === 0 ? (
        <p className="text-gray-600 text-lg">Aucun événement à venir pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listeEvenements.map((evenement) => (
            <EvenementCard 
              key={evenement.id} 
              evenement={evenement} 
              numeroWhatsApp={numeroWhatsApp} 
            />
          ))}
        </div>
      )}
    </main>
  );
}
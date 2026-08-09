import { createClient } from '@/lib/supabase/anon';
import { LivreCard } from './livre-card';
import type { Livre, Parametre } from '@/types/database';
import type { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();
  
  const { data: seo } = await supabase
    .from('page_seo')
    .select('titre, meta_description')
    .eq('chemin', '/livres')
    .single();

  return {
    title: seo?.titre || 'Nos Livres | Ministère Pastoral',
    description: seo?.meta_description || 'Découvrez nos ouvrages et ressources spirituels. Disponibles à l\'achat sur Amazon ou via WhatsApp.',
  };
}

async function getLivresEtParametres() {
  const supabase = createClient();

  const { data: livres, error: livresError } = await supabase
    .from('livre')
    .select('*')
    .order('date_creation', { ascending: false });

  const { data: parametreWA, error: waError } = await supabase
    .from('parametre')
    .select('valeur')
    .eq('cle', 'whatsapp_numero')
    .single();

  if (livresError) {
    console.error('Erreur fetch livres:', livresError.message);
  }
  
  // PGRST116 = Not Found (pas de paramètre WA configuré), on l'ignore silencieusement
  if (waError && waError.code !== 'PGRST116') {
    console.error('Erreur fetch parametre WA:', waError.message);
  }

  return {
    livres: (livres as Livre[]) || [],
    numeroWhatsApp: (parametreWA as Parametre)?.valeur || '',
  };
}

export default async function PageLivres() {
  const { livres, numeroWhatsApp } = await getLivresEtParametres();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Nos Livres
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Parcourez nos ouvrages pour approfondir votre foi et votre compréhension spirituelle.
        </p>
      </header>

      {livres.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-lg text-gray-500">Aucun livre n'est actuellement disponible.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {livres.map((livre) => (
            <LivreCard 
              key={livre.id} 
              livre={livre} 
              numeroWhatsApp={numeroWhatsApp} 
            />
          ))}
        </div>
      )}
    </main>
  );
}
import { createAnonClient } from '@/lib/supabase/anon';
import type { Contenu, Rubrique } from '@/types/database';
import type { Metadata } from 'next';
import Link from 'next/link';
import { extraireExtraitTexte, formaterDateFrancaise } from '@/lib/format';

export const revalidate = 3600;

type ContenuAvecRubrique = Contenu & {
  rubrique: Pick<Rubrique, 'nom'> | null;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contenus - Ministère Pastoral',
    description: 'Tous les contenus publiés du ministère pastoral.',
  };
}

async function getContenus(): Promise<ContenuAvecRubrique[]> {
  try {
    const supabase = createAnonClient();

    const { data, error } = await supabase
      .from('contenu')
      .select('*, rubrique(nom)')
      .eq('statut', 'publie')
      .order('date_publication', { ascending: false });

    if (error) {
      console.error('Erreur chargement contenus:', error.message);
      return [];
    }

    return (data ?? []) as ContenuAvecRubrique[];
  } catch (erreur) {
    console.error('Erreur inattendue:', erreur);
    return [];
  }
}

export default async function ContenusPage() {
  const contenus = await getContenus();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Contenus
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Découvrez tous les contenus publiés.
        </p>
      </header>

      {contenus.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-lg text-gray-500">
            Aucun contenu publié pour le moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {contenus.map((contenu) => (
            <article
              key={contenu.id}
              className="group rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <Link href={`/contenus/${contenu.id}`} className="block">
                {contenu.image_url && (
                  <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-md bg-gray-100">
                    <img
                      src={contenu.image_url}
                      alt={contenu.titre}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700">
                  {contenu.titre}
                </h2>
                {contenu.rubrique && (
                  <span className="mt-2 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    {contenu.rubrique.nom}
                  </span>
                )}
                <p className="mt-2 line-clamp-3 text-gray-600">
                  {extraireExtraitTexte(contenu.texte, 120)}
                </p>
                {contenu.date_publication && (
                  <time
                    dateTime={contenu.date_publication}
                    className="mt-3 block text-sm text-gray-500"
                  >
                    {formaterDateFrancaise(contenu.date_publication)}
                  </time>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

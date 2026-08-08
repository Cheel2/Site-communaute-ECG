import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createAnonClient } from '@/lib/supabase/anon';
import { extraireExtraitTexte, formaterDateFrancaise } from '@/lib/format';
import type { Contenu, Rubrique } from '@/types/database';
import { ViewTracker } from './view-tracker';

export const revalidate = 3600;

type ContenuDetailPageProps = {
  params: Promise<{ id: string }>;
};

type ContenuPublicAvecRubrique = Contenu & {
  rubrique: Pick<Rubrique, 'nom'> | null;
};

export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  try {
    const supabase = createAnonClient();

    // Filtre strict : seuls les contenus publiés sont pré-rendus.
    const { data, error } = await supabase
      .from('contenu')
      .select('id')
      .eq('statut', 'publie');

    if (error) {
      return [];
    }

    const lignes = (data ?? []) as Array<Pick<Contenu, 'id'>>;
    return lignes.map((ligne) => ({ id: ligne.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: ContenuDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const contenu = await fetchContenuPublie(id);

  if (!contenu) {
    notFound();
  }

  return {
    title: contenu.titre,
    description: extraireExtraitTexte(contenu.texte, 155) || undefined,
  };
}

export default async function ContenuDetailPage({ params }: ContenuDetailPageProps) {
  const { id } = await params;
  const contenu = await fetchContenuPublie(id);

  // Contenu inexistant OU non publié (même si l'ID est deviné) → 404.
  if (!contenu) {
    notFound();
  }

  const libelleVues = contenu.compteur_vues > 1 ? 'vues' : 'vue';

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-12">
      <ViewTracker contenuId={contenu.id} />

      <header>
        <Link
          href="/contenus"
          className="inline-block text-sm text-gray-600 hover:text-gray-900"
        >
          ← Retour aux contenus
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
          {contenu.titre}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
          {contenu.rubrique ? (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              {contenu.rubrique.nom}
            </span>
          ) : null}
          {contenu.date_publication ? (
            <time dateTime={contenu.date_publication}>
              {formaterDateFrancaise(contenu.date_publication)}
            </time>
          ) : null}
          <span aria-label={`${contenu.compteur_vues} ${libelleVues}`}>
            {contenu.compteur_vues} {libelleVues}
          </span>
        </div>
      </header>

      {contenu.image_url ? (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-md bg-gray-100">
          <Image
            src={contenu.image_url}
            alt={contenu.titre}
            fill
            priority
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      {/*
        SÉCURITÉ — dangerouslySetInnerHTML justifié dans ce contexte précis :
        1. Le HTML provient EXCLUSIVEMENT de l'éditeur TipTap (StarterKit + Link +
           Placeholder) configuré en back-office (MC-7). Ce schéma de nœuds ne
           génère ni balise <script>, ni gestionnaire d'événéments inline.
        2. L'accès en écriture est restreint aux administrateurs authentifiés
           (Supabase Auth + RLS rôle total + middleware /admin).
        3. Aucune saisie visiteur anonyme n'emprunte ce chemin d'écriture.
        Le risque XSS est donc maîtrisé ; ne pas réutiliser ce pattern pour un
        contenu d'origine non contrôlée.
      */}
      <div
        className="mt-8 text-gray-800 [&>*:first-child]:mt-0 [&_a]:text-blue-700 [&_a]:underline [&_blockquote]:mt-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:text-gray-600 [&_em]:italic [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_li]:leading-relaxed [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_p]:mt-4 [&_p]:leading-relaxed [&_strong]:font-semibold [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: contenu.texte }}
      />
    </article>
  );
}

async function fetchContenuPublie(
  id: string
): Promise<ContenuPublicAvecRubrique | null> {
  try {
    const supabase = createAnonClient();

    // Double filtre obligatoire : ID + statut publié.
    // Un contenu non_publie avec un ID deviné retourne null → notFound().
    const { data, error } = await supabase
      .from('contenu')
      .select('*, rubrique(nom)')
      .eq('id', id)
      .eq('statut', 'publie')
      .maybeSingle();

    if (error) {
      return null;
    }

    return (data ?? null) as ContenuPublicAvecRubrique | null;
  } catch {
    return null;
  }
}
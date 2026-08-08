import type { Metadata } from 'next';
import { createAnonClient } from '@/lib/supabase/anon';
import type { Banniere, Contenu, PageSeo } from '@/types/database';
import { HomePage } from './home-page';

export const revalidate = 3600;

const SEO_DEFAUT = {
  titre: 'Accueil - Ministère Pastoral',
  description: 'Bienvenue sur le site officiel',
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await lireSeoAccueil();

  return {
    // `absolute` neutralise le template '%s — Ministère Pastoral' du layout
    // pour un rendu littéral conforme à la spécification.
    title: {
      absolute: seo?.titre || SEO_DEFAUT.titre,
    },
    description: seo?.meta_description || SEO_DEFAUT.description,
    keywords: seo?.mots_cles
      ? seo.mots_cles.split(',').map((mot) => mot.trim())
      : undefined,
  };
}

export default async function AccueilPage() {
  const [banniere, derniersContenus] = await Promise.all([
    lireBanniere(),
    lireDerniersContenus(),
  ]);

  return <HomePage banniere={banniere} derniersContenus={derniersContenus} />;
}

async function lireSeoAccueil(): Promise<PageSeo | null> {
  try {
    const supabase = createAnonClient();

    const { data, error } = await supabase
      .from('page_seo')
      .select('*')
      .eq('chemin', '/');

    if (error) {
      return null;
    }

    const lignes = (data ?? []) as PageSeo[];
    return lignes[0] ?? null;
  } catch {
    return null;
  }
}

async function lireBanniere(): Promise<Banniere | null> {
  try {
    const supabase = createAnonClient();

    // .limit(1) sur table vide retourne [] (pas d'erreur PGRST116,
    // contrairement à .single()) → le fallback est atteint proprement.
    const { data, error } = await supabase
      .from('banniere')
      .select('*')
      .limit(1);

    if (error) {
      return null;
    }

    const lignes = (data ?? []) as Banniere[];
    return lignes[0] ?? null;
  } catch {
    return null;
  }
}

async function lireDerniersContenus(): Promise<Contenu[]> {
  try {
    const supabase = createAnonClient();

    const { data, error } = await supabase
      .from('contenu')
      .select('*')
      .eq('statut', 'publie')
      .order('date_publication', { ascending: false })
      .limit(3);

    if (error) {
      return [];
    }

    return (data ?? []) as Contenu[];
  } catch {
    return [];
  }
}
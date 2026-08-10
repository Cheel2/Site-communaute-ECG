import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { PublicFooter } from '@/components/public/Footer';
import { PublicHeader } from '@/components/public/Header';
import { CookieBanner } from '@/components/public/cookie-banner';
import { createAnonClient } from '@/lib/supabase/anon';
import type { PageSeo } from '@/types/database';

const METADONNEES_DEFAUT = {
  titre: 'Ministère Pastoral',
  description: 'Hub de contenu et de communication',
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const seoDefaut = await lireSeoParDefaut();

  return {
    title: {
      default: seoDefaut?.titre || METADONNEES_DEFAUT.titre,
      template: '%s — Ministère Pastoral',
    },
    description: seoDefaut?.meta_description || METADONNEES_DEFAUT.description,
    keywords: seoDefaut?.mots_cles
      ? seoDefaut.mots_cles.split(',').map((mot) => mot.trim())
      : undefined,
  };
}

async function lireSeoParDefaut(): Promise<PageSeo | null> {
  try {
    const supabase = createAnonClient();

    const { data, error } = await supabase
      .from('page_seo')
      .select('*')
      .in('chemin', ['/', 'default']);

    if (error) {
      return null;
    }

    const lignes = (data ?? []) as PageSeo[];
    return (
      lignes.find((ligne) => ligne.chemin === '/') ??
      lignes.find((ligne) => ligne.chemin === 'default') ??
      null
    );
  } catch {
    return null;
  }
}

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <CookieBanner />
    </div>
  );
}
